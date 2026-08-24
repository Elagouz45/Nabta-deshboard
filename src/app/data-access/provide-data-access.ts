import { Provider } from '@angular/core';
import { environment } from '@env/environment';
import { CatalogRepository } from './repositories/catalog.repository';
import { KnowledgeRepository } from './repositories/knowledge.repository';
import { AccountRepository } from './repositories/account.repository';
import { MockCatalogRepository } from './mock/mock-catalog.repository';
import { HttpCatalogRepository } from './api/http-catalog.repository';
import { MockKnowledgeRepository } from './mock/mock-knowledge.repository';
import { HttpKnowledgeRepository } from './api/http-knowledge.repository';
import { MockAccountRepository } from './mock/mock-account.repository';
import { HttpAccountRepository } from './api/http-account.repository';

export function provideDataAccess(): Provider[] {
  const mock = environment.useMockApi;
  return [
    { provide: CatalogRepository, useClass: mock ? MockCatalogRepository : HttpCatalogRepository },
    { provide: KnowledgeRepository, useClass: mock ? MockKnowledgeRepository : HttpKnowledgeRepository },
    { provide: AccountRepository, useClass: mock ? MockAccountRepository : HttpAccountRepository },
  ];
}
