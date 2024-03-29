import { useState, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch,  FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({ selected, onUpdateLanguage }) {
    
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

    return (
        <div>
            <ul className='flex-center'>
                {languages.map((language) => (
                    <li key={language}>
                        <button
                            style={language === selected ? { color: 'rgb(187, 46, 31)' } : null}
                            onClick={() => onUpdateLanguage(language)} 
                            className='btn-clear lang-nav-link'>
                                {language}
                        </button> 
                    </li>
                ))}
            </ul>
        </div>
    )
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired,
}

function ReposGrid({ repos }) {
    return (
        <ul className='grid space-between'>
            {repos.map((repo, index) => {

                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner
                
                return (
                    <li key={html_url}>
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={name}
                        >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text='Github username'>
                                        <FaUser color='rgb(255, 191, 116)' size={22} />
                                        <a href={`https://github.com/${login}`}>
                                            {login}
                                        </a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size={22} />
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                    {forks.toLocaleString()} forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                                    {open_issues.toLocaleString()} open
                                </li>
                            </ul>
                        </Card>
                    </li>
                )
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

function popularReducer(state, accion) {
    if(accion.type === 'success') {
        return {
            ...state,
            [accion.selectedLanguage]: accion.repos
        }
    } else if(accion.type === 'error') {
        return {
            ...state,
            error: accion.error
        }
    } else {
        throw new Error('Incorrect accion type')
    }
}

export default function Popular() {

    const [selectedLanguage, setSelectedLanguage] = useState('All')
    const [state, dispatch] = useReducer(popularReducer, { error: null })
    const fetchedLanguages = useRef([])

    useEffect(() => {
        if(fetchedLanguages.current.includes(selectedLanguage) === false) {
            fetchedLanguages.current.push(selectedLanguage)

            fetchPopularRepos(selectedLanguage)
                .then((repos) => dispatch({type: 'success', repos, selectedLanguage}))
                .catch((error) => dispatch({type: 'error', error}))
        }
    },[fetchedLanguages, selectedLanguage])

    const isLoading = () => !state[selectedLanguage] && state.error === null

    return(
        <>
            <LanguagesNav 
                selected={selectedLanguage}
                onUpdateLanguage={setSelectedLanguage}
            />
            {isLoading() && <Loading text='Fetching Repos' />}
            {state.error && <p className='center-text error'>{state.error}</p>}
            {state[selectedLanguage] && <ReposGrid repos={state[selectedLanguage]} />}
        </>
    )
}