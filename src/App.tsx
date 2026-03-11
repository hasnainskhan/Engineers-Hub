import './App.css'
import { useMemo, useState } from 'react'
import { Github, Linkedin, Link as LinkIcon, MapPin } from 'lucide-react'
import { loadDeveloperProfiles, type DeveloperProfile } from './lib/developers'

const { profiles: allProfiles, errors: loadErrors } = loadDeveloperProfiles()

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const chars = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).filter(Boolean)
  return chars.join('') || '?'
}

function ProfileCard({ profile }: { profile: DeveloperProfile }) {
  const { name, role, avatar, github, linkedin, portfolio, country } = profile
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false)

  const showImage = avatar && !avatarLoadFailed

  return (
    <article className="devCard">
      <div className="devCardInner">
        <div className="devAvatarWrap">
          {showImage ? (
            <img
              className="devAvatar"
              src={avatar}
              alt={name}
              loading="lazy"
              onError={() => setAvatarLoadFailed(true)}
            />
          ) : (
            <div className="devAvatarFallback" aria-hidden="true">
              {initials(name)}
            </div>
          )}
        </div>

        <h3 className="devName">{name}</h3>
        <p className="devRole">{role}</p>

        {country ? (
          <p className="devCountry">
            <MapPin size={14} aria-hidden />
            {country}
          </p>
        ) : null}

        <div className="devSocial" aria-label="Social links">
          {github ? (
            <a className="devSocialLink" href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={22} />
            </a>
          ) : null}
          {linkedin ? (
            <a
              className="devSocialLink"
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
          ) : null}
          {portfolio ? (
            <a
              className="devSocialLink"
              href={portfolio}
              target="_blank"
              rel="noreferrer"
              aria-label="Portfolio"
            >
              <LinkIcon size={22} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function App() {
  const [query, setQuery] = useState('')

  const profiles = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allProfiles

    return allProfiles.filter((p) => {
      const haystack = [
        p.name,
        p.role,
        p.country,
        ...p.skills,
        p.github ?? '',
        p.linkedin ?? '',
        p.portfolio ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Engineers Hub</h1>
          <p className="subtitle">
            A global, open-source directory of developers and tech creators.
          </p>
        </div>

        <div className="controls">
          <div className="search" role="search">
            <svg
              className="searchIcon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                d="M10.5 3a7.5 7.5 0 1 0 4.55 13.47l4.49 4.48a1 1 0 0 0 1.42-1.42l-4.48-4.49A7.5 7.5 0 0 0 10.5 3Zm-5.5 7.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z"
                fill="currentColor"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setQuery('')
              }}
              placeholder="Search by name, role, skill, country…"
              aria-label="Search developer profiles"
            />
            {query.trim().length > 0 ? (
              <button
                type="button"
                className="clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <span aria-hidden="true">×</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {loadErrors.length > 0 ? (
        <details className="errors">
          <summary>{loadErrors.length} profile file(s) skipped (failed validation)</summary>
          <ul>
            {loadErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </details>
      ) : null}

      <main className="grid" aria-label="Developer profiles">
        {profiles.map((p) => (
          <ProfileCard
            key={`${p.name}-${p.github ?? p.linkedin ?? p.portfolio ?? p.country}`}
            profile={p}
          />
        ))}
      </main>
    </div>
  )
}

export default App
