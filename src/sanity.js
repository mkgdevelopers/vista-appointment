import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'wm42uh0d', 
  dataset: 'production',
  apiVersion: '2023-10-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN,
})
