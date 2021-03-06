import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  navConfig: PropTypes.any,
  navFunc: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  isOpen: PropTypes.bool,
  staticContext: PropTypes.any,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

const defaultProps = {
  tag: 'nav',
  navConfig: {
    items: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        badge: { variant: 'info', text: 'NEW' }
      }]
  },
  isOpen: false
};

class SidebarNav extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.activeRoute = this.activeRoute.bind(this);
    this.hideMobile = this.hideMobile.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.currentTarget.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    return props.location.pathname.indexOf(routeName) > -1
      ? 'nav-item nav-dropdown open'
      : 'nav-item nav-dropdown';
  }

  hideMobile() {
    if (document.body.classList.contains('sidebar-show')) {
      document.body.classList.toggle('sidebar-show');
    }
  }

  navList(items) {
    return items.map((item, index) => this.navType(item, index));
  }

  navType(item, idx) {
    return (
      item.title ? this.navTitle(item, idx)
        : item.divider ? this.navDivider(item, idx)
          : item.label ? this.navLabel(item, idx)
            : item.children ? this.navDropdown(item, idx)
              : this.navItem(item, idx)
    );
  }

  navTitle(title, key) {
    const classes = classNames('nav-title', title.class);
    return <li key={key} className={classes}>{this.navWrapper(title)} </li>;
  }

  navWrapper(item) {
    return item.wrapper && item.wrapper.element ? React.createElement(item.wrapper.element, item.wrapper.attributes, item.name) : item.name;
  }

  navDivider(divider, key) {
    const classes = classNames('divider', divider.class);
    return <li key={key} className={classes} />;
  }

  navLabel(item, key) {
    const classes = {
      item: classNames('hidden-cn', item.class),
      link: classNames('nav-label', item.class ? item.class : ''),
      icon: classNames(
        'nav-icon',
        !item.icon ? 'fa fa-circle' : item.icon,
        item.label.variant ? `text-${item.label.variant}` : '',
        item.label.class ? item.label.class : '',
      )
    };
    return (
      this.navLink(item, key, classes)
    );
  }

  navDropdown(item, key) {
    const classIcon = classNames('nav-icon', item.icon);
    return (
      <li key={key} className={this.activeRoute(item.url, this.props)}>
        <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick}><i className={classIcon} />{item.name}{this.navBadge(item.badge)}</a>
        <ul className="nav-dropdown-items">
          {this.navList(item.children)}
        </ul>
      </li>);
  }

  navItem(item, key) {
    const classes = {
      item: classNames(item.class),
      link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
      icon: classNames('nav-icon', item.icon)
    };
    return (
      this.navLink(item, key, classes)
    );
  }

  navLink(item, key, classes) {
    const url = item.url ? item.url : '';
    const itemIcon = <i className={classes.icon} />
    const itemBadge = this.navBadge(item.badge)
    const attributes = item.attributes || {}
    return (
      <Nav.Item key={key} className={classes.item}>
        { attributes.disabled ?
            <Nav.Link href={""} className={classes.link} {...attributes}>
              {itemIcon}{item.name}{itemBadge}
            </Nav.Link>
         :
          this.isExternal(url) ?
            <Nav.Link href={url} className={classes.link} active {...attributes}>
              {itemIcon}{item.name}{itemBadge}
            </Nav.Link> :
            <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile} {...attributes}>
              {itemIcon}{item.name}{itemBadge}
            </NavLink>
        }
      </Nav.Item>
    );
  }

  navBadge(badge) {
    if (badge) {
      const classes = classNames(badge.class);

      return (
        <Badge className={classes} variant={badge.variant}>{badge.text}</Badge>
      );
    }
    return null;
  }

  isExternal(url) {
    const link = url ? url.substring(0, 4) : '';
    return link === 'http';
  }

  render() {
    const { className, children, navConfig, ...attributes } = this.props;

    delete attributes.isOpen
    delete attributes.staticContext
    delete attributes.Tag

    const navClasses = classNames(className, 'sidebar-nav');

    // ToDo: find better rtl fix
    const isRtl = getComputedStyle(document.querySelector('html')).direction === 'rtl'

    // sidebar-nav root
    return (
      <PerfectScrollbar className={navClasses} {...attributes} option={{ suppressScrollX: !isRtl }} >
        <Nav>
          {children || this.navList(navConfig.items)}
        </Nav>
      </PerfectScrollbar>
    );
  }
}

SidebarNav.propTypes = propTypes;
SidebarNav.defaultProps = defaultProps;

export default SidebarNav;
