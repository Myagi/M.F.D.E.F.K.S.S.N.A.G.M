import React, { createRef, Component } from 'react'

import { LoadingContainer } from './loading-container'
import { getUserUrl, getCompanyUrl } from './urls'
import { animation, stopAnimation } from './glitter-animation'
import { AvatarImage } from './avatar-image'
import { router } from './router'
import { PencilIcon } from './pencil-icon'

const AVATAR_IMAGE_SIZE = 100

export default class ProfilePageComponent extends Component {
  companyContainer = createRef()

  state = {
    loadingUser: true,
    loadingCompany: true,
    errorUser: false,
    errorCompany: false,
    user: null,
    company: null,
    viewScoreDetails: false,
  }

  goTo = () => {
    router.push('/company')
  }

  componentDidMount() {
    fetch(getUserUrl(this.props.userId)).then(r => {
      if(r.error) {
        this.setState({ ...this.state, errorUser: true })
      } else {
        this.setState({ ...this.state, loadingUser: false, user: r.user })
      }
    })
    fetch(getCompanyUrl(this.props.companyId)).then(r => {
      if(r.error) {
        this.setState({ ...this.state, errorCompany: true })
      } else {
        this.setState({ ...this.state, loadingCompany: false, company: r.company })
      }
    })
  }

  displayGlitterAnimation = () => {
    setTimeout(
      animation(this.companyContainer),
      1000
    ).then(() => {
      stopAnimation(this.companyContainer)
    })
  }

  componentDidReceiveProps(nextProps) {
    if (this.props.company == null && nextProps.company && nextProps.company.reachedGoal) {
      this.displayGlitterAnimation(nextProps.company)
    }
  }

  showPositionDetails = () => {
    if (this.props.user.positionDetails) {
      alert(this.props.user.positionDetails)
    } else {
      alert('No details for position')
    }
  }

  render() {
    return (
      <LoadingContainer
        loading={this.state.loadingUser || this.state.loadingCompany}
      >
        { this.state.errorUser
          ? <div style={style.error}>User error</div>
          : (
            <div style={style.userContainer}>
              <h1>{this.props.user.name}</h1>
              <div>
                {this.props.user.positionTitle}
                <button onClick={this.showPositionDetails}>
                  More about this position
                </button>
              </div>

              <button onClick={this.goTo}>Edit</button>
              <AvatarImage
                user={this.props.user}
                style={style.avatarImage}
                size={AVATAR_IMAGE_SIZE}
              />

              {this.props.userId === this.props.loggedInUser.id && (
                <button
                  style={style.editProfileButton}
                  onClick={this.goTo}
                >
                  Edit profile <PencilIcon />
                </button>
              )}
            </div>
          )
        }
        { this.state.errorCompany
          ? <div style={style.error}>Company error</div>
          : (
            <div style={style.companyContainer} ref={this.companyContainer}>
              <div style={style.companyName}>
                {this.props.company.name}
              </div>
              <div>
                User count: {this.props.company.userCount}
              </div>
              <div>
                Content score: {this.props.company.contentScore}
                <button onClick={() => this.setState({...this.state, viewScoreDetails: !this.state.viewScoreDetails})} style={style.stylishbutton}>
                  { this.state.viewScoreDetails
                    ? 'Hide details'
                    : 'Show details'
                  }
                </button>
                { this.state.viewScoreDetails &&
                  <div>
                    <h6>Scores</h6>
                    <div style={style.detailsText}>
                      This is how the company has done in the past 3 years
                    </div>
                    { this.props.company.contentScoreDetails.map(contentScore => {
                      const underThreshold = contentScore.value > 40
                      return (
                        <div>
                          {underThreshold
                            ? <div style={style.error}>{contentScore.label}: <i>{contentScore.value}</i></div>
                            : <div>{contentScore.label}: <b>{contentScore.value}</b></div>
                          }
                        </div>
                      )
                    })}
                  </div>
                }
              </div>
              <div style={style.companyManagerContainer}>
                {this.props.company.manager.name}
                <span style={style.muted}>{this.props.manager.jobTitle}</span>
                <div style={style.managerProfilePhotoContainer}><img syle={style.managerImageStyle} src={this.props.manager.profilePhoto} /></div>
              </div>
            </div>
          )
        }
      </LoadingContainer>
    )
  }
}

const style = {
  userContainer: {
    display: 'flex',
    backgroundColor: 'green',
  },
  companyManagerContainer: {
    display: 'inline-block',
    color: 'green',
  },
  avatarImage: {
    display: 'flex',
    flexDiretion: 'column',
  },
  editProfileButton: {
    color: 'blue',
    margin: 100,
  },
  error: {
    color: 'red',
  },
  muted: {
    color: 'grey',
    margin: 80,
  },
  managerProfilePhotoContainer: {
    textDecoration: 'underline',
  },
  companyContainer: {
    pointerEvents: 'none',
  },
  companyName: {
    display: 'flex',
    flexDiretion: 'column',
    color: 'green',
    pointerEvents: 'none',
  },
  managerImageStyle: {
    margin: 10,
  },
  stylishbutton: {
    backgroundColor: 'pink',
  },
  detailsText: {
    display: 'flex',
    flexDiretion: 'column',
    color: 'green',
    pointerEvents: 'none',
    margin: 10,
    padding: 10,
  },
}
