import { UserprofileModule } from './userprofile.module';

describe('UserprofileModule', () => {
  let userprofileModule: UserprofileModule;

  beforeEach(() => {
    userprofileModule = new UserprofileModule();
  });

  it('should create an instance', () => {
    expect(userprofileModule).toBeTruthy();
  });
});
