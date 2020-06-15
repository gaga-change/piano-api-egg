import { Service } from 'egg';
// import {DemoDocument} from "../model/Demo";

/**
 * Test Service
 */
export default class DemoService extends Service {

  public async findDemo() {
    // const {Demo} = this.ctx.model
    // const test = await new Demo({name: 'gaga1'}).save()
    // const list = await this.ctx.model.Demo.find({})

    // this.ctx.model.test
    // this.ctx.test
    // this.ctx.model.test
    // console.log(test.name)
    // console.log(list)
    // const test = new this.ctx.model.Demo();
    // this.app.model.Demo.fin
    // new this.ctx.model.De
    // console.log(test.name);
    const list = await this.ctx.model.Demo.find({})
    console.log(list[0].name)
    return this.ctx.model.Demo.find({});
  }
}
