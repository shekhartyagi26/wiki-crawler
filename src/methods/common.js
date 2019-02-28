function cb() {
    console.log("..");
}
//-------------------------------------------
class WaitFor {

    constructor() {
        this.counter = 0;
    }

    async waitFor(trueOrFalse, callBack = cb, time = 10, throwException = true) {

        //check if counter is greater than 10 execute callBack
        //restart whole process
        if (this.counter > time) {
            callBack();
            if (throwException) throw new Error('Waiting of selector taking more time');
            else return false;
        }

        const wait = () => new Promise(resolve => setTimeout(resolve, 1000));

        const exit = await trueOrFalse();

        if (exit === false) {
            console.log("need to wait ->" + this.counter);
            this.counter++
            await wait();
            return await this.waitFor(trueOrFalse, callBack, time);
        }
        else return callBack();
    }

}
//-------------------------------------------
module.exports = { WaitFor }
//-------------------------------------------







