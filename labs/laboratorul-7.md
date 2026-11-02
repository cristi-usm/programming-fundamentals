# Laboratorul 7

1. Se citesc două numere întregi. Elaborați un program cu două funcții, `suma` și `produs`, care primesc cele două numere și întorc suma, respectiv produsul lor. Rezultatele se afișează în `main`.

Date de intrare:

```
7 5
```

Date de ieșire:

```
Suma: 12
Produsul: 35
```

2. Se citesc două numere întregi. Elaborați un program cu o funcție `media`, care întoarce media aritmetică a celor două numere ca `double`. Media se afișează cu două zecimale.

Date de intrare:

```
7 4
```

Date de ieșire:

```
Media: 5.50
```

Date de intrare:

```
-3 8
```

Date de ieșire:

```
Media: 2.50
```

3. Se citesc trei numere întregi. Elaborați un program care afișează cel mai mare și cel mai mic dintre ele. Scrieți întâi funcțiile `max2` și `min2` pentru două numere, apoi funcțiile `max3` și `min3`, care le apelează pe primele.

Date de intrare:

```
4 17 9
```

Date de ieșire:

```
Maxim: 17
Minim: 4
```

Date de intrare:

```
-2 -8 -5
```

Date de ieșire:

```
Maxim: -2
Minim: -8
```

4. Se citesc trei numere întregi diferite. Elaborați un program cu o funcție `esteIntre(x, a, b)`, care întoarce `true` dacă x se află strict între a și b, indiferent care dintre a și b este mai mare. Folosind această funcție, programul afișează numărul care se află între celelalte două.

Date de intrare:

```
10 3 7
```

Date de ieșire:

```
Numarul din mijloc: 7
```

Date de intrare:

```
-4 6 1
```

Date de ieșire:

```
Numarul din mijloc: 1
```

5. Se citesc trei numere întregi. Elaborați un program cu o funcție `esteTriunghi`, care întoarce `true` dacă numerele pot fi lungimile laturilor unui triunghi și `false` în caz contrar. Laturile trebuie să fie pozitive, iar suma oricăror două laturi trebuie să fie mai mare decât a treia.

Date de intrare:

```
3 4 5
```

Date de ieșire:

```
Pot forma un triunghi
```

Date de intrare:

```
2 3 10
```

Date de ieșire:

```
Nu pot forma un triunghi
```

6. Se citesc trei numere întregi. Elaborați un program cu o funcție `estePrim`, care întoarce `true` dacă un număr este prim. Programul afișează câte dintre cele trei numere sunt prime și dacă cel puțin două dintre ele sunt prime.

Date de intrare:

```
7 10 13
```

Date de ieșire:

```
Numere prime: 2
Cel putin doua sunt prime
```

Date de intrare:

```
4 9 11
```

Date de ieșire:

```
Numere prime: 1
Mai putin de doua sunt prime
```

7. Se citesc două numere întregi. Elaborați un program cu o funcție `contineCifra(n, c)`, care întoarce `true` dacă cifra c apare în numărul n. Folosind această funcție, programul afișează în ordine crescătoare cifrele care apar în ambele numere, fiecare o singură dată. Dacă nu există nicio cifră comună, se afișează "Nu exista cifre comune".

Date de intrare:

```
12345 5832
```

Date de ieșire:

```
2 3 5
```

Date de intrare:

```
147 2580
```

Date de ieșire:

```
Nu exista cifre comune
```

## Pentru nota 10

8. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane. Elaborați un program cu funcții care:
   - citește elementele matricei (funcția `citeste`);
   - afișează matricea (funcția `afiseaza`);
   - întoarce elementul maxim (funcția `maxim`);
   - întoarce de câte ori apare o valoare dată în matrice (funcția `apare`).

   Programul afișează matricea, elementul maxim și de câte ori apare acesta.

Date de intrare:

```
3 4
5 9 2 9
1 7 9 3
8 4 6 0
```

Date de ieșire:

```
5 9 2 9
1 7 9 3
8 4 6 0
Maximul: 9
Apare de 3 ori
```

9. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane. Elaborați un program cu funcțiile `sumaLinie`, care întoarce suma elementelor de pe o linie dată, și `sumaColoana`, care întoarce suma elementelor de pe o coloană dată. Programul afișează sumele tuturor liniilor și ale tuturor coloanelor.

Date de intrare:

```
3 4
1 2 3 4
5 6 7 8
9 10 11 12
```

Date de ieșire:

```
Sume pe linii: 10 26 42
Sume pe coloane: 15 18 21 24
```

10. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane. Elaborați un program cu o funcție `sorteaza`, care sortează crescător un array de numere întregi. Programul apelează funcția pentru fiecare linie a matricei, apoi afișează matricea modificată. O linie a matricei, m[i], este un array și poate fi trimisă direct funcției.

Date de intrare:

```
3 4
7 2 9 1
4 8 3 5
6 0 -2 6
```

Date de ieșire:

```
1 2 7 9
3 4 5 8
-2 0 6 6
```
