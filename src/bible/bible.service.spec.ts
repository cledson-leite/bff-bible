import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { BibleService } from './bible.service';

describe('Bible Service', () => {
  let service: BibleService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL: 'https://4.dbt.io/api',
        }),
      ],
      providers: [BibleService],
    }).compile();

    service = module.get<BibleService>(BibleService);
    http = module.get<HttpService>(HttpService);
  });

  it('deveria retornar lista de versões disponivel', done => {
    const result = [
      { id: 'PORACF', name: 'Almeida Corrigida Fiel' },
      { id: 'PORBAR', name: 'Almeida Revista e Atualizada' },
      { id: 'PORTLH', name: 'Nova Tradução na Linguagem de Hoje' },
    ];

    const responseFake: AxiosResponse<any> = {
      data: {
        data: [
          { abbr: 'PORACF', name: 'Almeida Corrigida Fiel (ACF)' },
          { abbr: 'PORBAR', name: 'Almeida Revista e Atualizada' },
          {
            abbr: 'PORTLH',
            name: 'Nova Tradução na Linguagem de Hoje (NTLH, SBB 2000, FCBH 2011)',
          },
          { abbr: 'outra', name: 'Nova Tradução' },
          { abbr: 'qualquer', name: 'Nova Tradução qualquer' },
          { abbr: 'denovo', name: 'Nova Tradução de novo' },
        ],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    jest.spyOn(http, 'get').mockImplementationOnce(() => of(responseFake));
    service.buscarBiblias().subscribe({
      next: data => {
        expect(data).toEqual(result);
        done();
      },
    });
  });

  it('deveria retornar detalhe de versão passada', done => {
    const result = [
      {
        abrev: 'GEN',
        name: 'GÊNESIS',
        capitulos: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        ],
      },
      {
        abrev: 'EXO',
        name: 'ÊXODO',
        capitulos: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39, 40,
        ],
      },
    ];

    const responseFake: AxiosResponse<any> = {
      data: {
        data: {
          books: [
            {
              book_id: 'GEN',
              name: 'GÊNESIS',
              name_short: 'GÊNESIS',
              chapters: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
              ],
              book_seq: 'A01',
              testament: 'OT',
            },
            {
              book_id: 'EXO',
              name: 'ÊXODO',
              name_short: 'ÊXODO',
              chapters: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                35, 36, 37, 38, 39, 40,
              ],
              book_seq: 'A02',
              testament: 'OT',
            },
          ],
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    jest.spyOn(http, 'get').mockImplementationOnce(() => of(responseFake));
    service.detalheVersion('PORACF').subscribe({
      next: data => {
        expect(data).toEqual(result);
        done();
      },
    });
  });
  it('deveria retornar lista de versiculos por capitulo', done => {
    const result = [
      {
        abrev: 'GEN',
        livro: 'Genesis',
        capitulo: 1,
        versiculo: '1',
        texto: 'No princípio criou Deus os céus e a terra.',
      },
      {
        abrev: 'GEN',
        livro: 'Genesis',
        capitulo: 1,
        versiculo: '2',
        texto:
          'E a terra era sem forma e vazia; e havia  trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.',
      },
    ];

    const responseFake: AxiosResponse<any> = {
      data: {
        data: [
          {
            book_id: 'GEN',
            book_name: 'Genesis',
            book_name_alt: 'GÊNESIS',
            chapter: 1,
            chapter_alt: '',
            verse_start: 1,
            verse_start_alt: '1',
            verse_end: 1,
            verse_end_alt: '1',
            verse_text: 'No princípio criou Deus os céus e a terra.',
          },
          {
            book_id: 'GEN',
            book_name: 'Genesis',
            book_name_alt: 'GÊNESIS',
            chapter: 1,
            chapter_alt: '',
            verse_start: 2,
            verse_start_alt: '2',
            verse_end: 2,
            verse_end_alt: '2',
            verse_text:
              'E a terra era sem forma e vazia; e havia  trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.',
          },
        ],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    jest.spyOn(http, 'get').mockImplementationOnce(() => of(responseFake));
    service.detalheCapitulo('PORACF', 'GEN', 1).subscribe({
      next: data => {
        expect(data).toEqual(result);
        done();
      },
    });
  });
  it('deveria retornar  versiculos com palavra passada', done => {
    const result = {
      versiculos: [
        {
          abrev: '1CH',
          livro: 'I CRÔNICAS',
          capitulo: 1,
          versiculo: '27',
          texto: 'Abrão, que é Abraão.',
        },
        {
          abrev: '1CH',
          livro: 'I CRÔNICAS',
          capitulo: 1,
          versiculo: '28',
          texto: 'Os filhos de Abraão foram:  Isaque e Ismael.',
        },
      ],
      paginas: {
        total: 228,
        count: 15,
        per_page: 15,
        current_page: 1,
        total_pages: 16,
        links: {
          next: 'https://4.dbt.io/api/search?page=2',
        },
      },
    };

    const responseFake: AxiosResponse<any> = {
      data: {
        verses: {
          data: [
            {
              book_id: '1CH',
              book_name: '1 Chronicles',
              book_name_alt: 'I CRÔNICAS',
              chapter: 1,
              chapter_alt: '',
              verse_start: 27,
              verse_start_alt: '27',
              verse_end: 27,
              verse_end_alt: '27',
              verse_text: 'Abrão, que é Abraão.',
            },
            {
              book_id: '1CH',
              book_name: '1 Chronicles',
              book_name_alt: 'I CRÔNICAS',
              chapter: 1,
              chapter_alt: '',
              verse_start: 28,
              verse_start_alt: '28',
              verse_end: 28,
              verse_end_alt: '28',
              verse_text: 'Os filhos de Abraão foram:  Isaque e Ismael.',
            },
          ],
          meta: {
            pagination: {
              total: 228,
              count: 15,
              per_page: 15,
              current_page: 1,
              total_pages: 16,
              links: {
                next: 'https://4.dbt.io/api/search?page=2',
              },
            },
          },
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    jest.spyOn(http, 'get').mockImplementationOnce(() => of(responseFake));
    service.buscar('PORACF', 'abraão').subscribe({
      next: data => {
        expect(data).toEqual(result);
        done();
      },
    });
  });
  it('deveria retornar  versiculos com palavra passada no livro especifico', done => {
    const result = {
      versiculos: [
        {
          abrev: '1CH',
          livro: 'I CRÔNICAS',
          capitulo: 1,
          versiculo: '27',
          texto: 'Abrão, que é Abraão.',
        },
        {
          abrev: '1CH',
          livro: 'I CRÔNICAS',
          capitulo: 1,
          versiculo: '28',
          texto: 'Os filhos de Abraão foram:  Isaque e Ismael.',
        },
      ],
      paginas: {
        total: 228,
        count: 15,
        per_page: 15,
        current_page: 1,
        total_pages: 16,
        links: {
          next: 'https://4.dbt.io/api/search?page=2',
        },
      },
    };

    const responseFake: AxiosResponse<any> = {
      data: {
        verses: {
          data: [
            {
              book_id: '1CH',
              book_name: '1 Chronicles',
              book_name_alt: 'I CRÔNICAS',
              chapter: 1,
              chapter_alt: '',
              verse_start: 27,
              verse_start_alt: '27',
              verse_end: 27,
              verse_end_alt: '27',
              verse_text: 'Abrão, que é Abraão.',
            },
            {
              book_id: '1CH',
              book_name: '1 Chronicles',
              book_name_alt: 'I CRÔNICAS',
              chapter: 1,
              chapter_alt: '',
              verse_start: 28,
              verse_start_alt: '28',
              verse_end: 28,
              verse_end_alt: '28',
              verse_text: 'Os filhos de Abraão foram:  Isaque e Ismael.',
            },
          ],
          meta: {
            pagination: {
              total: 228,
              count: 15,
              per_page: 15,
              current_page: 1,
              total_pages: 16,
              links: {
                next: 'https://4.dbt.io/api/search?page=2',
              },
            },
          },
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    jest.spyOn(http, 'get').mockImplementationOnce(() => of(responseFake));
    service.buscarNoLivro('PORACF', 'abraão', '1ch').subscribe({
      next: data => {
        expect(data).toEqual(result);
        done();
      },
    });
  });
  it('deveria retornar porçoes de versiculos por capitulo', done => {
    const result = [
      {
        abrev: 'GEN',
        livro: 'GÊNESIS',
        capitulo: 1,
        versiculo: '1',
        texto: 'No princípio criou Deus os céus e a terra.',
      },
      {
        abrev: 'GEN',
        livro: 'GÊNESIS',
        capitulo: 1,
        versiculo: '2',
        texto:
          'E a terra era sem forma e vazia; e havia  trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.',
      },
    ];

    const responseFake: AxiosResponse<any> = {
      data: {
        verses: {
          data: [
            {
              book_id: 'GEN',
              book_name: 'Genesis',
              book_name_alt: 'GÊNESIS',
              chapter: 1,
              chapter_alt: '',
              verse_start: 1,
              verse_start_alt: '1',
              verse_end: 1,
              verse_end_alt: '1',
              verse_text: 'No princípio criou Deus os céus e a terra.',
            },
            {
              book_id: 'GEN',
              book_name: 'Genesis',
              book_name_alt: 'GÊNESIS',
              chapter: 1,
              chapter_alt: '',
              verse_start: 2,
              verse_start_alt: '2',
              verse_end: 2,
              verse_end_alt: '2',
              verse_text:
                'E a terra era sem forma e vazia; e havia  trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.',
            },
          ],
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };
    jest.spyOn(http, 'get').mockImplementationOnce(() => of(responseFake));
    service.porcaoVersiculo('PORACF', 'GEN', 1, 1, 2).subscribe({
      next: data => {
        expect(data).toEqual(result);
        done();
      },
    });
  });
});
