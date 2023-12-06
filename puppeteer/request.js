module.exports = async (options, name, callback) => {
    return await new Promise(async (resolve)=>{
        try {
            const result = await callback();
            if(!result && options.test) console.log(`\x1b[31mError with '${name}'\x1b[0m`);
            resolve(result);
        } catch (error) {
            if(options.test) console.log(`\x1b[31mError with '${name}'\x1b[0m`);
            if(options.debug) console.log(error);
            resolve(null)
        }
    })
}