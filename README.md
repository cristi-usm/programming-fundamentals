# Fundamentele Programării — lecții

Prezentările cursului *Fundamentele Programării* (limbajul **C**), construite cu
[Slidev](https://github.com/slidevjs/slidev).

Fiecare lecție este o **prezentare separată**, cu portul ei în dezvoltare.
Pagina principală (*hub*) este cuprinsul din care se deschide oricare lecție.

## Cum pornești

```bash
pnpm install
pnpm dev
```

Apoi deschide <http://localhost:3030> — cuprinsul.

`pnpm dev` pornește toate prezentările deodată. Dacă ai
[mprocs](https://github.com/pvolok/mprocs) instalat, fiecare rulează în panoul
ei; altfel output-ul este prefixat cu numele lecției.

Pentru mai puține servere:

```bash
pnpm dev:hub                    # doar cuprinsul
pnpm dev:05-arrays              # doar lecția 5
node scripts/dev.mjs hub 5 6    # cuprinsul și lecțiile 5–6
pnpm dev --lazy                 # doar cuprinsul; restul le pornești din mprocs (tasta s)
```

> Link-urile dintre lecții arată către `localhost:<port>`, deci lecția
> către care navighezi trebuie să ruleze.

## Lecții

| # | Lecție | Port |
|---|---|---|
| — | Cuprins (hub) | 3030 |
| 1 | Introducere | 3031 |
| 2 | Tipuri de date | 3032 |
| 3 | Input/Output *(schelet)* | 3033 |
| 4 | Condiționale | 3034 |
| 5 | Cicluri | 3035 |
| 6 | Funcții și recursivitate | 3036 |
| 7 | Debugging și bune practici *(schelet)* | 3037 |
| 8 | Tablouri | 3038 |
| 9 | Tablouri multidimensionale | 3039 |
| 10 | Șiruri de caractere | 3040 |
| 11 | Pointeri | 3041 |
| 12 | Memorie dinamică *(schelet)* | 3042 |
| 13 | Structuri și enum | 3043 |
| 14 | Fișiere *(schelet)* | 3044 |
| 15 | Proiect integrator *(schelet)* | 3045 |

Lista este generată din `common/lessons.json` — acolo se adaugă o lecție nouă.

## Editare

Conținutul unei lecții este în `slides/<slug>/slides.md`.

Partea de headmatter de sub linia `# == shared: … ==` este **generată**: se
editează în `scripts/sync-headmatter.mjs`, apoi

```bash
pnpm sync-headmatter
```

## Build

```bash
pnpm build     # totul în dist/
pnpm preview
```

Cuprinsul ajunge în `dist/`, fiecare lecție în `dist/<slug>/`.

## Contribuții

Dacă descoperi erori sau ai idei de îmbunătățire, contribuțiile sunt încurajate!
Poți trimite pull request-uri cu modificările sugerate.
