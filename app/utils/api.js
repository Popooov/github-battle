const id = "YOUR_CLIENT_ID"
const sec = "YOUR_SECRET_ID"
const params = `?client_id=${id}&client_secret=${sec}`

const getErrorMsg = (message, username) => {
  if (message === 'Not Found') {
    return `${username} doesn't exist`
  }

  return message
}

const getProfile = async (username) => {
  const res = await fetch(`https://api.github.com/users/${username}${params}`)
  const profile = await res.json()
  if (profile.message) {
    throw new Error(getErrorMsg(profile.message, username))
  }
  return profile
}

const getRepos = async (username) => {
  const res = await fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
  const repos = await res.json()
  if (repos.message) {
    throw new Error(getErrorMsg(repos.message, username))
  }
  return repos
}

const getStarCount = (repos) => repos.reduce((count, { stargazers_count }) => count + stargazers_count , 0)

const calculateScore = (followers, repos) => (followers * 3) + getStarCount(repos)

const getUserData = async (player) => {
  const [profile, repos] = await Promise.all([
    getProfile(player),
    getRepos(player)
  ])
  return ({
    profile,
    score: calculateScore(profile.followers, repos)
  })
}

const sortPlayers = (players) => players.sort((a, b) => b.score - a.score)

export const battle = async (players) => {
  const results = await Promise.all([
    getUserData(players[0]),
    getUserData(players[1])
  ])
  return sortPlayers(results)
}

export const fetchPopularRepos = async (language) => {
  const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)

  const res = await fetch(endpoint)
  const data = await res.json()
  if (!data.items) {
    throw new Error(data.message)
  }
  return data.items
}