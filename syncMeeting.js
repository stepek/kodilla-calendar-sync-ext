(function () {
  setInterval(function () {
    const inputs = document.querySelectorAll('#mentor-students-list > div.table-responsive.bootcamp-users-table > table > tbody > tr > td.next-call-at.important-data > form > input');

    Array.prototype.forEach.call(inputs, element => {
      if (element.parentNode.getElementsByClassName('ext-sync').length === 0) {
        const button = document.createElement('button');
        const i = document.createElement('i');

        i.classList.add('fa', 'fa-refresh');
        button.classList.add('btn', 'btn-primary', 'ext-sync');
        button.appendChild(i);
        button.addEventListener('click', syncButtonClick);

        element.parentNode.appendChild(button);
      }
    });
  }, 2000);

  function syncButtonClick(event) {
    event.preventDefault();

    const userDataElement = event.target.parentNode.parentNode.parentNode.getElementsByClassName('user-data')[0];
    const nextCall = event.target.parentNode.getElementsByTagName('input')[0].value;
    const name = userDataElement.getElementsByTagName('a')[0].innerText;
    const email = userDataElement.getElementsByTagName('p')[1].innerText;
    sendData(name, email, nextCall)

  }

  function sendData(name, email, time) {
    chrome.runtime.sendMessage({
      action: 'syncCall',
      source: {
        name: name,
        email: email,
        time: time
      }
    });
  }
})();
