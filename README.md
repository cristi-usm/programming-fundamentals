# Fundamentele Programării — laboratoare

Prezentările cursului *Fundamentele Programării* (limbajul **C**), construite cu
[Slidev](https://github.com/slidevjs/slidev).

Fiecare laborator este o **prezentare separată**, cu portul ei în dezvoltare.
Pagina principală (*hub*) este cuprinsul din care se deschide oricare laborator.

## Cum pornești

```bash
pnpm install
pnpm dev
```

Apoi deschide <http://localhost:3030> — cuprinsul.

`pnpm dev` pornește toate prezentările deodată. Dacă ai
[mprocs](https://github.com/pvolok/mprocs) instalat, fiecare rulează în panoul
ei; altfel output-ul este prefixat cu numele laboratorului.

Pentru mai puține servere:

```bash
pnpm dev:hub                    # doar cuprinsul
pnpm dev:05-arrays              # doar laboratorul 5
node scripts/dev.mjs hub 5 6    # cuprinsul și laboratoarele 5–6
pnpm dev --lazy                 # doar cuprinsul; restul le pornești din mprocs (tasta s)
```

> Link-urile dintre laboratoare arată către `localhost:<port>`, deci laboratorul
> către care navighezi trebuie să ruleze.

## Laboratoare

| # | Laborator | Port |
|---|---|---|
| — | Cuprins (hub) | 3030 |
| 1 | Introducere. Structura unui program C. Variabile | 3031 |
| 2 | Tipuri de date. Operatori & operanzi | 3032 |
| 3 | Instrucțiuni condiționale | 3033 |
| 4 | Instrucțiuni ciclice | 3034 |
| 5 | Tablouri | 3035 |
| 6 | Tablouri multidimensionale | 3036 |
| 7 | Șiruri de caractere | 3037 |
| 8 | Funcții | 3038 |
| 9 | Pointeri | 3039 |
| 10 | Recapitulare | 3040 |
| 11 | Enumuri, structuri și fișiere | 3041 |

Lista este generată din `common/labs.json` — acolo se adaugă un laborator nou.

## Editare

Conținutul unui laborator este în `slides/<slug>/slides.md`.

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

Cuprinsul ajunge în `dist/`, fiecare laborator în `dist/<slug>/`.

## Contribuții

Dacă descoperi erori sau ai idei de îmbunătățire, contribuțiile sunt încurajate!
Poți trimite pull request-uri cu modificările sugerate.
