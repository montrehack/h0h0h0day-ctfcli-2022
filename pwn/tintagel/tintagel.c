#include <stdio.h>
#include <stddef.h>
#include <unistd.h>
#include <sys/ptrace.h>
char invitation[] = "Je viens officiellement adresser au Roi Arthur de Bretagne une invitation du peuple de Tintagel à la grande fête de l'hiver qui se déroulera dans 5 semaines à compter d'aujourd'hui.";
char declin[] = "Le peuple de Tintagel y peut aller se gratter!";
char refus[] = "J'y vais pas parce que c'est hyper loin, déjà. Parce que Tintagel, même si, soit-disant, c'est mes racines, j'ai dû y foutre les pieds deux fois dans ma vie. Et que se geler les noix jusqu'à 6 plombes du mat à chanter des machins en patois, c'est définitivement pas mon truc. Voilà! Et en plus, ben, y'a ma connasse de tente, que j'peux pas blairer.";
int main(int argc, char *argv[])
{
	setvbuf(stdout, NULL, _IONBF, 0);
	setvbuf(stderr, NULL, _IONBF, 0);
	if (argc == 2) {
		puts(invitation);
		void (*ptr)(char *);
		char * ptrr;
		if (fscanf(stdin, "Adresse: %p\n", &ptr) != 1) {
			puts(refus);
		};
		if (fscanf(stdin, "Encore: %p\n", &ptrr) != 1) {
			puts(declin);
		}
		ptr(ptrr);
	} else {
		execlp("strace", "strace", "--string-limit=832", argv[0], "sapin", NULL);
	}
}
