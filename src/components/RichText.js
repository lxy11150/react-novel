import React from 'react';

const RichText = ({ richTextContent }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: richTextContent }} />
  );
};

export default RichText;
