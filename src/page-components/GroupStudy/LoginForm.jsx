import React,{ useState,useEffect } from 'react';
import axios from 'axios';

const projectID = '22f2d28b-d574-4882-a4ef-bf0e45a8baf4';
const private_key = 'c0c0bcd3-4a17-484b-9baa-c715713dc869';

const Modal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [Data, setData] = useState()

  useEffect(() => {
    if(Data)
    {
      if(Data.is_authenticated)
      {
        console.log(Data);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        window.location.reload();
        setError('');
      }
      else
      {
        alert(error);
      }
    }
  },[Data])

  const handleSignUp = async (e) => {
    e.preventDefault();

    // const authObj1 = { 'PRIVATE-KEY': private_key};
    // const authObj2 = { 'username':username, 'secret':password};

    var myHeaders = new Headers();
  myHeaders.append("PRIVATE-KEY", private_key);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({"username":username,"secret":password});

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.chatengine.io/users/", requestOptions)
    .then(response => response.json())
    .then(response => setData(response))
    .then(result => console.log(result))
    .catch(error => setError(error));
    
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authObject = { 'Project-ID': projectID, 'User-Name': username, 'User-Secret': password };

    try {
      await axios.get('https://api.chatengine.io/chats', { headers: authObject });

      localStorage.setItem('username', username);
      localStorage.setItem('password', password);

      window.location.reload();
      setError('');
    } catch (err) {
      setError('Oops, incorrect credentials.');
    }
  };

  return (
    <div className="wrapperGS">
      <div className="form">
        <h1 className="title">Welcome to your Study Space!</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" style={{display:'block'}} value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" ></input>
          <input type="password" style={{display:'block'}} value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Password" required />
          <div align="center">
            <button type="submit" className="button">
              <span>Start chatting</span>
            </button>
          </div>
           <div align="center">
            <button onClick={()=>handleSignUp(event)} className="button">
              <span>SignUp</span>
            </button>
          </div>
        </form>
        <h1>{error}</h1>
      </div>
    </div>

  );
};

export default Modal;
