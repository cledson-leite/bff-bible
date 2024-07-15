import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class BibleService {
  constructor(private readonly http: HttpService) {}

  buscarBiblias(): Observable<any> {
    const url = 'bibles';
    const idioma = 'language_code=POR';
    const key = 'key=6dd2041c-559e-47e0-98fa-f4f8980fb7e7';
    const version = 'v=4';
    return this.http.get(`/${url}?${idioma}&${version}&${key}`).pipe(
      map((response: any) => {
        return response.data;
      }),
      map((bibles: any) => {
        return bibles.data.filter(
          (item: any) =>
            item.name === 'Almeida Corrigida Fiel (ACF)' ||
            item.name === 'Almeida Revista e Atualizada' ||
            item.name ===
              'Nova Tradução na Linguagem de Hoje (NTLH, SBB 2000, FCBH 2011)',
        );
      }),
      map((version: any) => {
        return version.map((bible: any) => {
          const name = bible.name.split('(')[0].trim();
          return { id: bible.abbr, name };
        });
      }),
      catchError(error => {
        return throwError(() => new Error(error));
      }),
    );
  }
  detalheVersion(id: string): Observable<any> {
    const url = 'bibles';
    const key = 'key=6dd2041c-559e-47e0-98fa-f4f8980fb7e7';
    const version = 'v=4';
    return this.http.get(`/${url}/${id}?${version}&${key}`).pipe(
      map((response: any) => {
        return response.data;
      }),
      map((version: any) => version.data.books),
      map((books: any) => {
        return books.map((book: any) => {
          return {
            abrev: book.book_id,
            name: book.name.trim(),
            capitulos: book.chapters,
          };
        });
      }),
      catchError(error => {
        return throwError(() => new Error(error));
      }),
    );
  }
  detalheCapitulo(
    id: string,
    livro: string,
    capitulo: number,
  ): Observable<any> {
    const url = 'bibles/filesets';
    const key = 'key=6dd2041c-559e-47e0-98fa-f4f8980fb7e7';
    const version = 'v=4';
    return this.http
      .get(`/${url}/${id}/${livro}/${capitulo}?${version}&${key}`)
      .pipe(
        map((response: any) => {
          return response.data;
        }),
        map((capitulo: any) => capitulo.data),
        map((verses: any) => {
          return verses.map((verse: any) => {
            return {
              abrev: verse.book_id,
              livro: verse.book_name_alt.trim(),
              capitulo: verse.chapter,
              versiculo: verse.verse_start_alt,
              texto: verse.verse_text,
            };
          });
        }),
        catchError(error => {
          return throwError(() => new Error(error));
        }),
      );
  }
  porcaoVersiculo(
    id: string,
    livro: string,
    capitulo: number,
    inicio: number,
    fim: number,
  ): Observable<any> {
    const url = 'bibles/filesets';
    const key = 'key=6dd2041c-559e-47e0-98fa-f4f8980fb7e7';
    const version = 'v=4';
    const porcao = `verse_start=${inicio}&verse_end=${fim}`;
    return this.http
      .get(`/${url}/${id}/${livro}/${capitulo}?${porcao}&${version}&${key}`)
      .pipe(
        map((response: any) => {
          return response.data;
        }),
        map((porcao: any) => porcao.verses.data),
        map((verses: any) => {
          return verses.map((verse: any) => {
            return {
              abrev: verse.book_id,
              livro: verse.book_name_alt.trim(),
              capitulo: verse.chapter,
              versiculo: verse.verse_start_alt,
              texto: verse.verse_text,
            };
          });
        }),
        catchError(error => {
          return throwError(() => new Error(error));
        }),
      );
  }
  buscar(id: string, query: string): Observable<any> {
    const url = 'search';
    const key = 'key=6dd2041c-559e-47e0-98fa-f4f8980fb7e7';
    const version = 'v=4';
    return this.http
      .get(`/${url}?${query}&${id}&page=1&${version}&${key}`)
      .pipe(
        map((response: any) => {
          return response.data;
        }),
        map((porcao: any) => porcao.verses),
        map((verses: any) => {
          const versiculos = verses.data.map((verse: any) => {
            return {
              abrev: verse.book_id,
              livro: verse.book_name_alt.trim(),
              capitulo: verse.chapter,
              versiculo: verse.verse_start_alt,
              texto: verse.verse_text,
            };
          });
          const paginas = verses.meta.pagination;
          return { versiculos, paginas };
        }),
        catchError(error => {
          return throwError(() => new Error(error));
        }),
      );
  }
  buscarNoLivro(
    id: string,
    query: string,
    abreviacao: string,
  ): Observable<any> {
    const url = 'search';
    const key = 'key=6dd2041c-559e-47e0-98fa-f4f8980fb7e7';
    const livro = `books=${abreviacao}`;
    const version = 'v=4';
    return this.http
      .get(`/${url}?${query}&${id}&${livro}&page=1&${version}&${key}`)
      .pipe(
        map((response: any) => {
          return response.data;
        }),
        map((porcao: any) => porcao.verses),
        map((verses: any) => {
          const versiculos = verses.data.map((verse: any) => {
            return {
              abrev: verse.book_id,
              livro: verse.book_name_alt.trim(),
              capitulo: verse.chapter,
              versiculo: verse.verse_start_alt,
              texto: verse.verse_text,
            };
          });
          const paginas = verses.meta.pagination;
          return { versiculos, paginas };
        }),
        catchError(error => {
          return throwError(() => new Error(error));
        }),
      );
  }
}
