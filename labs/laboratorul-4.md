# Laboratorul 4

1. Se citește un număr întreg n (4 < n < 1000), apoi n numere întregi într-un array. Elaborați un program care afișează numerele în ordinea inversă introducerii lor.

Date de intrare:

```
6
3 8 -2 7 10 5
```

Date de ieșire:

```
5 10 7 -2 8 3
```

2. Se citește un număr întreg n (4 < n < 1000), apoi n numere întregi într-un array. Elaborați un program care afișează pozițiile numerelor care sunt în același timp negative și impare. Pozițiile se numerotează de la 0. Dacă nu există niciun astfel de număr, se afișează "Nu exista".

Date de intrare:

```
7
4 -3 8 -5 -6 1 -7
```

Date de ieșire:

```
1 3 6
```

Date de intrare:

```
5
2 -4 6 1 3
```

Date de ieșire:

```
Nu exista
```

3. Se citește un număr întreg n (4 < n < 1000), apoi n numere întregi într-un array. Elaborați un program care afișează, cu două zecimale, media numerelor pare. Dacă nu există niciun număr par, se afișează "Nu exista numere pare".

Date de intrare:

```
6
3 8 5 4 7 10
```

Date de ieșire:

```
Media numerelor pare: 7.33
```

Date de intrare:

```
5
1 3 5 7 9
```

Date de ieșire:

```
Nu exista numere pare
```

4. Se citește un număr întreg n (4 < n < 1000), apoi n numere întregi într-un array. Elaborați un program care afișează cele mai mari două numere, în ordine descrescătoare. Dacă cel mai mare număr apare de două ori, el se afișează de două ori.

Date de intrare:

```
6
12 45 7 33 -2 19
```

Date de ieșire:

```
45 33
```

Date de intrare:

```
5
8 20 3 20 11
```

Date de ieșire:

```
20 20
```

5. Se citește un număr întreg n (n < 1000), apoi n numere întregi într-un array. Elaborați un program care dublează elementele pare și triplează elementele impare, apoi afișează array-ul modificat.

Date de intrare:

```
5
3 8 -1 6 7
```

Date de ieșire:

```
9 16 -3 12 21
```

6. Se citește un număr întreg n (n < 1000), apoi n numere întregi într-un array. Elaborați un program care schimbă între ele primul element și elementul minim, apoi afișează array-ul modificat. Dacă minimul apare de mai multe ori, se folosește prima lui apariție.

Date de intrare:

```
6
7 4 9 -2 5 8
```

Date de ieșire:

```
-2 4 9 7 5 8
```

7. Se citește un număr întreg n (n < 1000), apoi n numere întregi pozitive într-un array. Elaborați un program care construiește un array nou, format doar din elementele array-ului inițial care au cel puțin trei divizori. Se afișează ambele array-uri.

Date de intrare:

```
8
7 12 9 1 13 6 4 25
```

Date de ieșire:

```
Initial: 7 12 9 1 13 6 4 25
Nou: 12 9 6 4 25
```

8. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane. Elaborați un program care afișează câte elemente sunt pare și mai mici decât 10.

Date de intrare:

```
3 4
2 15 7 8
12 4 -6 9
1 10 6 3
```

Date de ieșire:

```
Elemente pare mai mici decat 10: 5
```

9. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane, apoi două numere a și b. Elaborați un program care afișează elementele de pe coloana a și elementele de pe linia b. Liniile și coloanele se numerotează de la 0. Dacă a sau b nu este o poziție validă, se afișează "Pozitie invalida".

Date de intrare:

```
3 4
1 2 3 4
5 6 7 8
9 10 11 12
2 1
```

Date de ieșire:

```
Coloana 2: 3 7 11
Linia 1: 5 6 7 8
```

Date de intrare:

```
3 4
1 2 3 4
5 6 7 8
9 10 11 12
5 1
```

Date de ieșire:

```
Pozitie invalida
```

10. Se citește un număr întreg n (n < 10). Elaborați un program care construiește o matrice pătratică n × n cu primele n * n numere pare, completată linie cu linie, apoi o afișează.

Date de intrare:

```
3
```

Date de ieșire:

```
2 4 6
8 10 12
14 16 18
```

11. Se citește n (n < 10), apoi elementele unei matrice pătratice de numere întregi cu n linii și n coloane. Elaborați un program care mărește cu 5 elementele de pe diagonala principală, apoi afișează matricea modificată.

Date de intrare:

```
3
1 2 3
4 5 6
7 8 9
```

Date de ieșire:

```
6 2 3
4 10 6
7 8 14
```

12. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane. Elaborați un program care înlocuiește fiecare element divizibil cu 3 cu triplul elementului maxim, apoi afișează matricea modificată. Maximul se determină din matricea inițială, înainte de orice înlocuire.

Date de intrare:

```
2 3
4 9 5
6 7 12
```

Date de ieșire:

```
4 36 5
36 7 36
```

13. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane. Elaborați un program care adaugă matricei o linie nouă, în care fiecare element este suma elementelor de pe coloana respectivă, apoi afișează matricea cu linia adăugată.

Date de intrare:

```
3 4
1 2 3 4
5 6 7 8
9 10 11 12
```

Date de ieșire:

```
1 2 3 4
5 6 7 8
9 10 11 12
15 18 21 24
```

14. Se citesc n și m (n, m < 10), apoi elementele unei matrice de numere întregi cu n linii și m coloane. Elaborați un program care afișează suma maximă a unei linii și elementele liniei care are această sumă. Dacă mai multe linii au aceeași sumă maximă, se afișează prima dintre ele.

Date de intrare:

```
3 3
4 -1 2
3 3 3
10 -8 1
```

Date de ieșire:

```
Suma maxima: 9
Linia: 3 3 3
```

15. Se citește n (n < 10), apoi elementele unei matrice pătratice de numere întregi cu n linii și n coloane. Elaborați un program care afișează elementele de pe diagonala secundară, de sus în jos, și suma lor. Diagonala secundară pleacă din colțul din dreapta sus și ajunge în colțul din stânga jos.

Date de intrare:

```
4
2 0 5 1
3 8 6 4
7 9 1 2
6 3 0 5
```

Date de ieșire:

```
Diagonala secundara: 1 6 9 6
Suma: 22
```
