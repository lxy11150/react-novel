import React, { useEffect, useState } from 'react';
import { barnerImagesData3 } from '@/utils/index';

const Scenery = () => {
  const [allImagesData, setAllImagesData] = useState(barnerImagesData3);
  const [layers, setLayers] = useState([]);
  const [compensate, setCompensate] = useState(0);

  // 计算线性插值
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  // 初始化图片元素
  const initItems = () => {
    const currentCompensate = window.innerWidth > 1650 ? window.innerWidth / 1650 : 1;
    setCompensate(currentCompensate);

    if (layers.length <= 0) {
      document.getElementById('app').style.display = 'none';
      const newLayers = allImagesData.map((item, i) => {
        const layer = document.createElement('div');
        layer.classList.add('layer');
        layer.style.transform = new DOMMatrix(item.transform);
        item.opacity && (layer.style.opacity = item.opacity[0]);
        const img = document.createElement('img');
        img.src = item.url;
        img.style.filter = `blur(${item.blur}px)`;
        img.style.width = `${item.width * currentCompensate}px`;
        layer.appendChild(img);
        document.getElementById('app').appendChild(layer);
        return layer;
      });
      setLayers(newLayers);
      document.getElementById('app').style.display = '';
    } else {
      layers.forEach((layer, i) => {
        layer.firstElementChild.style.width = `${allImagesData[i].width * currentCompensate
          }px`;
      });
    }
  };

  useEffect(() => {
    initItems();
  }, []); // componentDidMount

  let initX = 0;
  let moveX = 0;
  let startTime = 0;
  const duration = 300; // 动画持续时间（毫秒）

  // 滑动操作
  const mouseMove = () => {
    animate();
  };

  // 鼠标离开，执行回正动画
  const leave = () => {
    startTime = 0;
    requestAnimationFrame(homing);
  };

  // 回正动画
  const homing = (timestamp) => {
    !startTime && (startTime = timestamp);
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    animate(progress);
    progress < 1 && requestAnimationFrame(homing);
  };

  // 执行动画
  const animate = (progress) => {
    if (layers.length <= 0) return;
    const isHoming = typeof progress === 'number';

    layers.forEach((layer, i) => {
      const item = allImagesData[i];
      let m = new DOMMatrix(item.transform);
      let move = moveX * item.a;
      let s = item.f ? item.f * moveX + 1 : 1;
      let g = moveX * (item.g || 0);

      if (isHoming) {
        m.e = lerp(moveX * item.a + item.transform[4], item.transform[4], progress);
        move = 0;
        s = lerp(item.f ? item.f * moveX + 1 : 1, 1, progress);
        g = lerp(item.g ? item.g * moveX : 0, 0, progress);
      }

      m = m.multiply(new DOMMatrix([m.a * s, m.b, m.c, m.d * s, move, g]));

      if (item.deg) {
        const deg = isHoming ? lerp(item.deg * moveX, 0, progress) : item.deg * moveX;
        m = m.multiply(new DOMMatrix([Math.cos(deg), Math.sin(deg), -Math.sin(deg), Math.cos(deg), 0, 0]));
      }

      if (item.opacity) {
        layer.style.opacity = isHoming && moveX > 0 ? lerp(item.opacity[1], item.opacity[0], progress) : lerp(item.opacity[0], item.opacity[1], moveX / window.innerWidth * 2);
      }

      layer.style.transform = m;
    });
  };

  // 鼠标滑入与滑动
  const handleMouseEnter = (e) => (initX = e.pageX)

  const handleMouseMove = (e) => {
    moveX = e.pageX - initX;
    requestAnimationFrame(mouseMove);
  };

  // 添加事件监听
  useEffect(() => {
    document.getElementById('app').addEventListener('mouseenter', handleMouseEnter);
    document.getElementById('app').addEventListener('mousemove', handleMouseMove);
    document.getElementById('app').addEventListener('mouseleave', leave);
    window.addEventListener('resize', initItems);

    return () => {
      // 清除事件监听
      document.getElementById('app').removeEventListener('mouseenter', handleMouseEnter);
      document.getElementById('app').removeEventListener('mousemove', handleMouseMove);
      document.getElementById('app').removeEventListener('mouseleave', leave);
      window.removeEventListener('resize', initItems);
    };
  }, [allImagesData, layers, moveX]); // 添加依赖项以防止不必要的重复监听

  return (
    <div className="scenery">
      <div id="app">loading...</div>
    </div>
  );
};

export default Scenery;

