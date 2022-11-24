// node test.js
const main = require('./index')

    ; (async () => {
        try {
            let e = {
                bucket: 'codefleet-hris-storage',
                prefix: 'files-live',
                key: 'medium-5426bf94cd948e04c41aaa12bc6034d2243fd8cfd4cab46e6fc42589aa41e6edb0d91c6e13bac517f79d9b85ea1890515ee693725a04794912636df4b60ba70b.jpeg',
            }
        
            let data = await main.handler(e, null);
            console.log(data)
        } catch (err) {
            console.error(err)
        }
    })()
