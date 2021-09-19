import { Status } from '../entities/Status';
import { status } from '../seed-data';

export class StatusSeeder {
  public static async execute() {
    for (const currentStatus of status) {
      await Object.assign(new Status(), {
        name: currentStatus
      }).save();
    }
  }
}
