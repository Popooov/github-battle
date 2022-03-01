import './index.css'
import { render } from 'react-dom'
import { useState, lazy, Suspense, StrictMode } from 'react'
import { ThemeProvider } from './contexts/theme'
import Nav from './components/Nav'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loading from './components/Loading'

const Popular = lazy(() => import('./components/Popular'))
const Battle = lazy(() => import('./components/Battle'))
const Results = lazy(() => import('./components/Results'))

function App() {
    
    const [theme, setTheme] = useState('light')
    const toggleTheme = () => setTheme((t) => t === 'light' ? 'dark' : 'light')

    return (
        <Router>
            <ThemeProvider value={theme}>
                <div className={theme}>
                    <div className='container'>
                        <Nav toggleTheme={toggleTheme} />

                        <Suspense fallback={<Loading />}>
                            <Switch>
                                <Route exact path='/' component={Popular} />
                                <Route exact path='/battle' component={Battle} />
                                <Route exact path='/battle/results' component={Results} />
                                <Route render={() => <h1>404</h1>} />
                            </Switch>
                        </Suspense>
                    </div>
                </div>
            </ThemeProvider>
        </Router>
    )
}

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('app')
)