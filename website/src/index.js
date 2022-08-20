import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Grommet } from 'grommet';
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams
} from 'react-router-dom';

ReactDOM.render(
  <Grommet>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/!CL_DEMO_32x32/bafybeicr66ob43zu7leqopu45bx3fytchkyd5qv2a6dfcgqc7ewc7skgta/bafkreier6xkncx24wj4wm7td3v2k3ea2r2gpfg2qamtvh7digt27mmyqkm/thevibes-space-game-v0" />} />
        <Route path="/hashville" element={<Navigate to="/tuxmon-sample-32px-extruded/QmQMdg8j9ssWbRxjKWb8JBW3PLAPvQN5cxZEP8DmhY1jrj/QmeSesTyeikbLnVjQnsgvhfxJrQz6taYLZxkDsbve7ntej/hashville-v0" />} />
        <Route path="/hashoperation" element={<Navigate to="/AllAssetsPreview/QmNhhHG84xkV4h8s8vBw6bQHncDwzyvcJZ8eAUqgmKMi63/QmVpCeH52ya9gWdGnsa1u6z7kDLTPosUoPxhuYkwfqgKqi/hashoperation-v0" />} />
        <Route path="/badrobots-v0" element={<Navigate to="/destruction/bafkreig2opzec3rhplcedyztvorfuls3cqjx3qj3gtrbhemzipf52tm5za/bafkreihakwnufz66i2nmbh3qr7jiri3ulhqwpsc2gimsqzypl4arsuyway/badrobots-v0" />} />
        <Route path="/thespace3d-v0" element={<Navigate to="/null/bafybeiho6f7gewdwolfnhuqzkxi2vlla3p6o4qwvzo4ovto434b3bwf7l4/0.1/theSpace3d-v0" />} />
        <Route path="/colorghosts-v0" element={<Navigate to="/null/bafybeibresff33jvjkhzoiuryojkvi6i3tpxcj2yv7bvq23i4svvmy435y/1/colorNghosts-v0" />} />
        <Route path="/:mapName/:mapHash/:mapTiles/:spaceName" element={<App />} />
        <Route path="*" element={<Navigate to="/!CL_DEMO_32x32/bafybeicr66ob43zu7leqopu45bx3fytchkyd5qv2a6dfcgqc7ewc7skgta/bafkreier6xkncx24wj4wm7td3v2k3ea2r2gpfg2qamtvh7digt27mmyqkm/thevibes-space-game-v0" />} />
      </Routes>
    </Router>
  </Grommet>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
