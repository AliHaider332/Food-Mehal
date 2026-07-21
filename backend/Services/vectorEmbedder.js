import { pipeline } from '@xenova/transformers';

const embedder = await pipeline(
  'feature-extraction',
  'Xenova/all-MiniLM-L6-v2'
);

export const embedding = async (textForEmbedding) => {
  const output = await embedder(textForEmbedding, {
    pooling: 'mean',
    normalize: true,
  });
  // console.log(output.data);
  
  return Array.from(output.data);
};