import {createRoot} from 'react-dom/client';
import './css/normalize'
import './css/variables'
import './css/fonts'

import {App} from './App'
import {StrictMode} from 'react';

const container = document.getElementById('app');
if (!container) {
    throw new Error('Элемент с id "app" не найден.')
}

const root = createRoot(container)

root.render((
    <StrictMode>
        <App/>
    </StrictMode>
))
