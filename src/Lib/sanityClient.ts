import { createClient } from '@sanity/client' 
import imageUrlBuilder from '@sanity/image-url'; 

const client = createClient({
  projectId: '6u3v1bpx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

export default client


