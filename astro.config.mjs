// @ts-nocheck
import { defineConfig } from "astro/config";
import mdx from '@astrojs/mdx';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://nanjingbaoche.com',
  base: '/',
  output: 'static',

  integrations: [
    icon({
       include: {
        bi: ['list','x-lg','arrow-up','star-fill','person-badge','shield-check','people','leaf','headset','award','house','compass','arrow-right','chevron-left','chevron-right','calendar-event','clock','check-circle','geo-alt','send','envelope','telephone','car-front','train-front','airplane','briefcase','wechat','quote','route','luggage','chevron-down',
        ],
      }
    }),
    mdx(),
  ],

  vite: {
    resolve: {
      alias: {
        '@img': '/src/img',
      },
    }
  }
});
