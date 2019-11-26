import React from 'react'
import { battle } from '../utils/api'
import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaCode, FaUser } from 'react-icons/fa'
import Card from './Card'
import PropTypes from 'prop-types'
import Loading from './Loading'
import Tooltip from './Tooltip'
import queryString from 'query-string'
import { Link } from 'react-router-dom'

function ProfileList({ profile }) {
    return (
        <ul className='card-list'>
            <li>
                <FaUser color='rgb(239, 115, 115)' size={22} />
                {profile.name}
            </li>
            {profile.location && (
                <li>
                    <Tooltip text="User's location">
                        <FaCompass color='rgb(144, 115, 255)' size={22} />
                        {profile.location}
                    </Tooltip>
                </li>
            )}
            {profile.company && (
                <li>
                    <Tooltip text="User's company">
                        <FaBriefcase color='#795548' size={22} />
                        {profile.company}
                    </Tooltip>
                </li>
            )}
            {profile.blog && (
                <li>
                    <Tooltip text={profile.blog}>
                        <FaCode color='rgb(66, 245, 203)' size={22} />
                        <a href={profile.blog} target='_blank'>
                            User's Blog
                        </a>
                    </Tooltip>
                </li>
            )}
            <li>
                <FaUsers color='rgb(129, 195, 245)' size={22} />
                {profile.followers.toLocaleString()} followers
            </li>
            <li>
                <FaUserFriends color='rgb(64, 183, 95)' size={22} />
                {profile.following.toLocaleString()} following
            </li>
        </ul>
    )
}

ProfileList.propTypes = {
    profile: PropTypes.object.isRequired
}

function battleReducer(state, accion) {
    if (accion.type === 'success') {
        return {
            winner: accion.player[0],
            loser: accion.player[1],
            error: null,
            loading: false
        }
    } if (accion.type === 'error') {
        return {
            ...state,
            error: accion.message,
            loading: false
        }
    } else {
        throw new Error(`That action type isn't supported.`)
    }
}

export default function Results({ location }) {

    const { playerOne, playerTwo } = queryString.parse(location.search)
    const [state, dispatch] = React.useReducer(battleReducer, {
        winner: null,
        loser: null,
        error: null,
        loading: true
    })

    React.useEffect(() => {
        battle([playerOne, playerTwo])
            .then((players) => dispatch({type: 'success', player: players}))
            .catch(({ message }) => dispatch({type: 'error', message}))
    }, [playerOne, playerTwo])

    const { winner, loser, error, loading } = state

    if(loading === true) {
        return <Loading text='Battling' />
    }

    if(error) {
        return (
            <p className='center-text error'>{error}</p>
        )
    }

    return (
        <React.Fragment>
            <div className='grid space-around container-sm'>
                <Card
                    header={winner.score === loser.score ? 'Tie' : 'Winner'}
                    avatar={winner.profile.avatar_url}
                    subheader={`Score: ${winner.score.toLocaleString()}`}
                    href={winner.profile.html_url}
                    name={winner.profile.login}
                >
                    <ProfileList profile={winner.profile} />
                </Card>
                <Card
                    header={winner.score === loser.score ? 'Tie' : 'Loser'}
                    avatar={loser.profile.avatar_url}
                    subheader={loser.score.toLocaleString()}
                    href={loser.profile.html_url}
                    name={loser.profile.login}
                >
                    <ProfileList profile={loser.profile} />
                </Card>
            </div>
            <Link 
                className='btn dark-btn btn-space'
                to='/battle'
            >
                Reset
            </Link>
        </React.Fragment>
    )
}