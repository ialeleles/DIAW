fetch ('/produtos')
    .then (res => res.json())
    .then (data => {
        data.forEach(element => {
            document.body.innerHTML += (`<p>${element.descricao}<p>`)
        });
    })