const $postDelete = document.querySelector('[data-post]')

$postDelete.addEventListener('click', async (e) => {
    if (e.target.dataset.action) {
        const parent = e.target.closest('[data-id]')
        const parentId = e.target.closest('[data-id]').dataset.id

        const response = await fetch('/photopost', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: e.target.dataset.action
            })
        })

        if (response.status === 200) {
            parent.remove()
            } else alert("No possible")
    }
}
)