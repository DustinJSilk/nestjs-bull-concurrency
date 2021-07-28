import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue } from 'bull';

/**
 * We expect only 5 active jobs named red to run at a time, however, 15
 * red jobs run in parallel.
 */
@Processor('colours')
export class ColoursConsumer {
  constructor(@InjectQueue('colours') private coloursQueue: Queue) {
    // Create 100 'red' named tasks
    this.createTasks('red', 100);

    // Emit a waiting and active counts regularly
    setInterval(async () => {
      const counts = await this.coloursQueue.getJobCounts();
      console.log(`waiting: ${counts.waiting}     active: ${counts.active}`);
    }, 100);
  }

  @Process({ name: 'red', concurrency: 5 })
  async red() {
    await this.wait(1000);
  }

  @Process({ name: 'green', concurrency: 5 })
  async green() {
    await this.wait(1000);
  }

  @Process({ name: 'blue', concurrency: 5 })
  async blue() {
    await this.wait(1000);
  }

  /** Creates any amount of new tasks of any colour */
  private async createTasks(colour: string, length: number) {
    await Promise.all(
      Array.from({ length }).map(() => this.coloursQueue.add(colour, {})),
    );
  }

  /** Return a promise that resolves after [time] in milliseconds. */
  private wait(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
