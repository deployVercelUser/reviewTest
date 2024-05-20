console.log('work')
var websiteName = 'https://www.google.com'
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'IDENTIFY') {
        console.log(websiteName)
        websiteName = event.data.data
    }
})
self.addEventListener('fetch', function(event) {
    console.log(event.request)
    console.log(event.request.url)
    if (event.request.url.includes('https://review-alegebra.vercel.app/') || event.request.url == "https://fonts.gstatic.com/s/quicksand/v31/6xKtdSZaM9iE8KbpRA_hK1QN.woff2") {
        event.respondWith(
            fetch(event.request)
        );
    } else {
        if (event.request.body != null) {
            var data = event.request.body.getReader()
            data.read().then(function pump({ done, value }) {
                var dataBody = new TextDecoder().decode(value)
                var url = event.request.url
                if (url.includes('https://review-alegebra.vercel.app/'))  {
                    url = url.replace('https://review-alegebra.vercel.app/', 'websiteName')
                }
                console.log(event)
                var headers = Object.fromEntries(event.request.headers)
                headers['origin'] = 'websiteName'
                headers['referer'] = 'websiteName'

                event.respondWith(
                    fetch('/proxy', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            url: url,
                            method: event.request.method,
                            body: dataBody,
                            headers: headers
                        })
                    })
                );
            })
        } else {
            var url = event.request.url
            if (url.includes('https://review-alegebra.vercel.app/'))  {
                url = url.replace('https://review-alegebra.vercel.app/', 'websiteName')
            }
            var headers = Object.fromEntries(event.request.headers)
            headers['origin'] = 'websiteName'
            headers['referer'] = 'websiteName'

            console.log(event)
            event.respondWith(
                fetch('/proxy', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        url: url,
                        method: event.request.method,
                        headers: headers
                    })
                })
            );
        }    
    }
    
});


