// Toggling Login parts
requestAnimationFrame(() => {
    const loginForms = document.querySelectorAll('.login-disp > div');
    const loginTogglers = document.querySelectorAll('.login-switch > button');

    loginForms.forEach((node, index) => {
        if(index === 0) {
            loginTogglers[index].classList.toggle('active')
            node.style.display = 'block';
        } else {
            node.style.display = 'none';}
    })

    loginTogglers.forEach(node => {
        node.addEventListener('click', (e) => {
            loginForms.forEach((node, index) => {
                if(node.id === e.target.dataset.toggle) {
                    node.style.display = 'block';
                    if (!loginTogglers[index].classList.contains('active')) {
                        loginTogglers[index].classList.toggle('active')
                    }
                } else {
                    loginTogglers[index].classList.remove('active')
                    node.style.display = 'none';
                }
            })
        })
    })
})

// Toggling signup parts
requestAnimationFrame(() => {
    const signupForms = document.querySelectorAll('.sign-disp > div');
    const signupTogglers = document.querySelectorAll('.sign-switch > button');

    signupForms.forEach((node, index) => {
        if(index === 0) {
            signupTogglers[index].classList.toggle('active')
            node.style.display = 'block';
        } else {
            node.style.display = 'none';}
    })

    signupTogglers.forEach(node => {
        node.addEventListener('click', (e) => {
            signupForms.forEach((node, index) => {
                if(node.id === e.target.dataset.toggle) {
                    node.style.display = 'block';
                    if (!signupTogglers[index].classList.contains('active')) {
                        signupTogglers[index].classList.toggle('active')
                    }
                } else {
                    signupTogglers[index].classList.remove('active')
                    node.style.display = 'none';
                }
            })
        })
    })
})

// Checking status of alert
requestAnimationFrame(() => {
    const alertBox = document.querySelector('.alert');
    const alertCloseBtn = document.querySelector('.alert-close');
    const alertMsg = document.querySelector('.alert-text');

    alertCloseBtn.addEventListener('click', (e) => {
      document.querySelector(`#${e.target.dataset.toggle}`).style.display = 'none';
    });

    if (alertMsg.children.length > 0) {
      alertBox.classList.toggle('open');
    }
})

// Set
function setToggle(toggler,toggledSelector)  {
    const switcher = document.querySelectorAll(toggler);
    return switcher.forEach(node => {
        node.addEventListener('click', (e) => {
            // eval(e.target.dataset?.execute);
            document.querySelectorAll(toggledSelector).forEach(node => {
                if(node.id === e.target.dataset.toggle) {
                    node.style.display = 'block'
                } else {
                    node.style.display = 'none'
                }
                }
            );
        })
    })
}


setToggle('.switch-1','.align-center > div');
setToggle('.switch','main > div');

// function generateOrders() {
//     console.log('Yes we can')
//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
//     const day = new Date()
// }