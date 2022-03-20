const async = require("hbs/lib/async")

const $postDelete = document.querySelector('[data-post]')

$postDelete.addEventListener('click', async (e) => {
    if (e.target.dataset.action) {
        const parentId = e.target.closest('[data-id]').dataset.id

        const response = await fetch(`/photobook/${parentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: e.target.dataset.action
            })
        })

        if (response.status === 200) {
            const dataFromServer = await response.json()
        }
    }
})