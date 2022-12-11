import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TYPEORM_CUSTOM_REPOSITORY } from './typeorm.decorator';

export default class TypeOrmCustomModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    ...repositories: T[]
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const Repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_CUSTOM_REPOSITORY, Repository);

      if (entity) {
        providers.push({
          inject: [getDataSourceToken()],
          provide: Repository,
          useFactory: (dataSource: DataSource): typeof Repository => {
            const baseRepository = dataSource.getRepository<any>(entity);
            return new Repository(
              baseRepository.target,
              baseRepository.manager,
              baseRepository.queryRunner,
            );
          },
        });
      }
    }

    return {
      exports: providers,
      module: TypeOrmCustomModule,
      providers,
    };
  }
}
