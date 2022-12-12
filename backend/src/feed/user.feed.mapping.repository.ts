import { CustomRepository } from '@root/common/typeorm/typeorm.decorator';
import UserFeedMapping from '@root/entities/UserFeedMapping.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserFeedMapping)
export class UserFeedMappingRepository extends Repository<UserFeedMapping> {}
