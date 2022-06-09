

window.addEventListener("load", (event)=>{
    let hidden = true
    const addListForm = document.querySelector('.addListForm');
    
    document.querySelector('.addList')
        .addEventListener('click', (e) => {
            if (hidden) {
                addListForm.style.display = 'none'
                hidden = !hidden;
            } else {
                addListForm.style.display = 'block'
                hidden = !hidden;
            }
    })
        
    document.querySelector('.addListForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const urlArray = window.location.href.split('/')
            const userId = urlArray[urlArray.length - 1];
            const name = document.querySelector('.addListInput').value;
            await fetch('/lists/new', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name,
                    userId
                })
            });


    }); 

    document.querySelector('.newTaskForm')
        .addEventListener('submit', async(e) => {
            e.preventDefault();
            const urlArray = window.location.href.split('/')
            const userId = urlArray[urlArray.length - 1];
            const task = document.querySelector('.newTaskInput').value;
            const res = await fetch('/lists');
            const lists = await res.json();
            console.log(lists)
            
            console.log('***************')
            // await fetch('/tasks/new', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify({
            //         listId,
            //         task
            //     })
            // });
        });

})