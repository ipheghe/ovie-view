const loadData = () => {
let content = {
  "query": `{
    viewer { 
      login
      bio
      avatarUrl
      followers {
        totalCount
          }
      repositories(
        ownerAffiliations:[OWNER],
        first: 20,
        orderBy:{
          field: PUSHED_AT
          direction: DESC
        }
      ) {
        totalCount
        nodes {
          createdAt
          description
          forks(first: 20) {
            totalCount
            nodes {
              description
              name
                      }
          }
          isFork
          isMirror
          licenseInfo {
            name
            description
            url
          }
          name
          owner {
            login
          }
          parent {
            nameWithOwner
            url
            forks {
                totalCount
            }
          }
          primaryLanguage {
            color
            name
          }
          shortDescriptionHTML
          stargazerCount
          templateRepository {
            url
            name
          }
          updatedAt
          url
        }
      }
      following{
        totalCount
      }
      status {
        emoji
        emojiHTML
      }
      starredRepositories {
        totalCount
      }
    }
  }
`};

let body = JSON.stringify(content);

fetch('https://api.github.com/graphql', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'bearer ec2dce70dafc1faf477de9b6c8c7c9743c75c666'
  },
  body: body
})
  .then(response => response.json())
  .then(data => {
    const userDetails = data && data.data.viewer;
    const userAvatarElements = document.getElementsByClassName('avatar');
    const usernameElements = document.getElementsByClassName('profile-name');
    const bioElements = document.getElementsByClassName('bio');
    const isFollowedElements = document.getElementsByClassName('isFollowed');
    const isFollowingElements = document.getElementsByClassName('isFollowing');
    const isStarredElements = document.getElementsByClassName('isStarred');
    const counterElemenrs =  document.getElementsByClassName('Counter');
    const repoElements = document.getElementsByClassName('repo__container');
    Array.from(userAvatarElements).forEach(element => {
      element.src = userDetails.avatarUrl;
    });

    Array.from(usernameElements).forEach(element => {
      element.innerHTML = userDetails.login;
    });

    Array.from(bioElements).forEach(element => {
      element.innerHTML = userDetails.bio;
    });

    Array.from(counterElemenrs).forEach(element => {
      element.innerHTML = userDetails.repositories.totalCount;
    });

    if (userDetails.followers.totalCount) {
      Array.from(isFollowedElements).forEach(element => {
        element.style.display = 'unset';
        element.querySelector('.followers').innerHTML = userDetails.followers.totalCount;
      });
    }

    if (userDetails.following.totalCount) {
      Array.from(isFollowingElements).forEach(element => {
        element.style.display = 'unset';
        element.querySelector('.following').innerHTML = userDetails.following.totalCount;
      });
    }

    if (userDetails.starredRepositories.totalCount) {
      Array.from(isStarredElements).forEach(element => {
        element.style.display = 'unset';
        element.querySelector('.starred').innerHTML = userDetails.starredRepositories.totalCount;
      });
    }

    if (userDetails.repositories.nodes.length) {
      Array.from(repoElements).forEach(element => {
        userDetails.repositories.nodes.forEach(item => {
          const date = new Date(item.updatedAt);
          const showYear = new Date().getFullYear() === date.getFullYear() ? '' : date.getFullYear();
          const updatedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' }).slice(0,3)} ${showYear}`
          element.innerHTML += `<ul>
          <li class="repo-item">
            <div class="repo-item__text">
              <div class="repo-name">
                <h3><a href="#">${item.name}</a></h3>
                ${item.parent && `<span>Forked from <a>${item.parent.nameWithOwner}</a></span>`}
              </div>
              <div>
                <p>${item.description || ''}</p>
              </div>
              <div class="info-content">
                ${item.primaryLanguage ? item.primaryLanguage.name && `<span class="info-text">
                <span class="repo-language-color" style="color: ${item.primaryLanguage.color};"></span>
                <span>${item.primaryLanguage.name}</span>
              </span>` : ''}
                ${item.parent ? `<a class="info-text" href=${item.parent.url}>
                <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img">
                  <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                </svg>
                ${item.parent.forks.totalCount}
                </a>` : ''}
                ${!item.parent && item.forks && item.forks.totalCount ? `<a class="info-text" href="#">
                <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img">
                  <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                </svg>
                ${item.forks.totalCount}
                </a>` : ''}
                ${item.licenseInfo ? `<span style="margin-right: 16px;">
                <svg class="octicon octicon-law mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path>
                </svg>${item.licenseInfo.name}
              </span>` : ''}
                Updated <time datetime=${item.updatedAt} class="no-wrap" title=${item.updatedAt}>on ${updatedDate}</time>
              </div>
            </div>
            <div class="repo-star-button__container">
              <button type="button" value="Star" aria-label="Star this repository" title="Star ipheghe/docker-aws" class="btn">
                <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                </svg>
                Star
              </button>
            </div>
          </li>
          </ul>`
        });
      });
    }
  });
}

