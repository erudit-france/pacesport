## First time
### pull
### run ```npm install```
### see *Getting Started* section
## Getting Started


```bash
npm run dev
```
built using node 16.8.0

#### Déploiment

###### Chemins
- /home/ubuntu/pacesport-front (pour pacesport.fr)
- /home/ubuntu/pacesport-front-dev (pour pacesport.fr:8082)

- pacesport-front et pacesport-front-dev utilisent la même bdd

###### Pull & publication
```
$ git pull
$ npm run build
# pour pacesport.fr
$ pm2 reload pacesport
# pour pacesport.fr:8082
$ pm2 reload pacesport-test

# possibilité d'enchainer les commandes
$ git pull && npm run build && pm2 reload pacesport
```

##### Dépendances / Librairies
- Composants: Mantine UI (v5) https://v5.mantine.dev/
- Css: TailwindCSS (les classes sont préfixées par tw- (ex: p-4 -> tw-p-4)) https://tailwindcss.com/
- Dates: MomentJS https://momentjs.com/
