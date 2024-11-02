<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors](https://img.shields.io/github/contributors/twenty7dn/site.svg?style=for-the-badge)](https://github.com/twenty7dn/site/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/twenty7dn/site.svg?style=for-the-badge)](https://github.com/twenty7dn/site/forks)
[![Stargazers](https://img.shields.io/github/stars/twenty7dn/site.svg?style=for-the-badge)](https://github.com/twenty7dn/site/stargazers)
[![Issues](https://img.shields.io/github/issues/twenty7dn/site.svg?style=for-the-badge)](https://github.com/twenty7dn/site/issues)
[![MIT License](https://img.shields.io/github/license/twenty7dn/site.svg?style=for-the-badge)](https://github.com/twenty7dn/site/blob/main/LICENSE)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/twenty7dn/site">
    <img src="https://github.com/twenty7dn/site/blob/master/public/images/logo.svg?raw=true" alt="Logo" width="512" height="512" style="aspect-ratio:1/1;">
  </a>

<h3 align="center">Twentyseven Degrees North</h3>
  <p align="center">
    Exploration on a budget!
    <br />
    <a href="https://twenty7.tv/" target="_blank">View Site</a>
    ·
    <a href="https://github.com/twenty7dn/site/issues">Report Bug</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![the blog](https://github.com/twenty7dn/site/blob/master/public/images/snap.png?raw=true)

Join us on an adventurous journey through van and trucking life! Our blog is your ultimate guide to exploring the world on a budget. From practical tips for living on the road to inspiring stories of wanderlust, 'Twentyseven Degrees North' offers a unique glimpse into the thrills and challenges of mobile living. Dive into our world where every mile is a story!

<hr/>

#### Overview

This project is a modern, dynamic blog built using NextJS as the front-end framework and a headless WordPress setup for content management. Leveraging the power of NextJS, the blog offers a fast, responsive, and SEO-friendly user experience, while WordPress serves as a robust and intuitive back-end for content creation and management.

#### Key Features

- **NextJS Integration**: Utilizing NextJS, the blog benefits from its server-side rendering and static generation features. This ensures quick load times and a smooth user experience, which is crucial for retaining readers and improving search engine rankings.

- **Headless WordPress**: WordPress, known for its flexibility and ease of use in content management, is used in a 'headless' mode. This means that while WordPress is used for managing content, it is decoupled from the front-end presentation layer. This setup allows for more creative freedom and performance optimization in how content is displayed.

- **Responsive Design**: The blog is designed to be fully responsive, providing an optimal viewing experience across a wide range of devices.

- **SEO Optimization**: SEO optimization through RankMath ensures that our blog ranks well on search engine results pages (SERPs).

#### Why NextJS with Headless WordPress?

The combination of NextJS and headless WordPress offers several advantages:

- **Performance and Scalability**: NextJS's efficient handling of server-side rendering and static generation, paired with WordPress's powerful content management capabilities, results in a high-performance and scalable blog solution.

- **Flexibility in Design**: Decoupling WordPress from the front end allows for greater flexibility and customization in the design and user experience, unbound by the constraints of traditional WordPress themes.

- **Enhanced Security**: A headless setup can enhance security as the WordPress admin area is separate from the public-facing site.

- **Content Rich & Easy to Manage**: WordPress provides a familiar and feature-rich environment for content creation, making it easy for writers and editors to manage posts, pages, and media.

### Built With

[![NextJS](https://img.shields.io/badge/next.js-000000?&logo=nextdotjs&style=for-the-badge)](https://nextjs.org/)
[![WordPress](https://img.shields.io/badge/wordpress-21759b?&logo=wordpress&style=for-the-badge)](https://wordpress.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com/)
[![imgix](https://img.shields.io/badge/imgix-EC663B?&logo=imgix&style=for-the-badge)](https://imgix.com/)

<small>Note: I'm planning to switch away from imgix. I'll probably be going with <a href="https://www.twicpics.com/" target="_blank">TwicPics</a>.</small>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

1. yarn

```sh
$ npm install --global yarn
```

2. composer

##### MacOS

```sh
$ brew install composer
```

##### Windows

```sh
$ choco install composer
```

### Installation

1. Clone the repo

```sh
$ git clone https://github.com/twenty7dn/site.git
$ cd site
$ yarn install
```

2. Setup your environment variables

```js
WORDPRESS_HOST = "the_url_of_your_wordpress_blog";
FRONTEND_HOST = "the_url_of_your_live_nextjs_site";
IMGIX_HOST = "the_hostname_of_your_imgix_source"; // Note: Just the domain/subdomain. No https:// or anything else.
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## WordPress Setup

### Installation

1. Install your WordPress site. I recommend <a href="https://localwp.com">LocalWP</a> to start.
2. Install <a href="https://wordpress.org/plugins/wp-subtitle/" target="_blank">WP Subtitle</a>. I will be switching to ACF as this plugin hasn't been updated.
3. Go buy <a href="https://www.advancedcustomfields.com" target="_blank">Advanced Custom Fields Pro</a>. You won't regret it.
4. Once you've purchased and downloaded ACF, install it.
5. Once you have ACF, you'll need <a href="https://wordpress.org/plugins/acf-extended/" target="_blank">ACF Extended</a>. The free version is all we need.
6. Clone the WordPress theme into the wp-content/themes directory.
   ```sh
   $ git clone https://github.com/twenty7dn/twenty7.git
   ```
7. Clone the imgix plugin into the wp-content/plugins directory.
   ```sh
   $ git clone https://github.com/twenty7dn/imgix.git
   $ cd imgix
   $ composer install
   ```
8. Clone the core plugin into the wp-content/plugins directory.
   ```sh
   $ git clone https://github.com/twenty7dn/core.git
   $ cd core
   $ composer install
   ```
9. (<strong>Optional</strong>) Get my Bookmarks plugin for WordPress.
   ```sh
   $ git clone https://github.com/twenty7dn/bookmarks.git
   ```
10. Add the following constants to your wp-config.php file.

```php
define( 'HEADLESS_MODE_CLIENT_URL', 'your_wordpress_url' );
define( 'HEADLESS_FRONTEND_URL', 'your_nextjs_url' );
define( 'ACF_PRO_LICENSE', 'acf_pro_key' );
define( 'IMGIX_DOMAIN_LOCAL', 'domain_for_local_imgix' );
define( 'IMGIX_DOMAIN_REMOTE', 'domain_for_remote_proxy_imgix' ); // No longer available on the free plan. Exclusive to Enterprise plans only.
define( 'IMGIX_SIGN_KEY_LOCAL', 'imgix_local_sign_key' );
define( 'IMGIX_SIGN_KEY_REMOTE', 'imgix_remote_proxy_sign_key' );
define( 'CDN_DOMAIN', 'cdn_host' ); // Just the domain/subdomain. This is for your favicons. I recommend BunnyCDN. If you wish to not use a CDN, just put the WordPress host here.
```

11. Activate imgix, core, then twenty7. I will eventually setup proper dependencies.

### Setup

The Twenty7 theme introduces new fields to Settings › General.

#### Settings › General

##### Images

- <strong>Favicon</strong>: This relies on imgix to generate the various necessary images and files. It will also generate a favicon.ico for you. Most of these are served over imgix, but favicon.ico, site.webmanifest, and browserconfig.xml are stored in the theme's assets and served over your choice of CDN.
- <strong>Icon</strong>: This is used only on the login page thus far.
- <strong>Logo</strong>: Appears on the side-panel of the NextJS site.
- <strong>Background</strong>: Appears as the background for the site. <small>(Note: Not always completely visible.)</small>

##### Footer

- <strong>Desktop</strong>: The full footer text that will appear on larger screens.
- <strong>Mobile</strong>: A truncated footer text that appears on smaller screens.
<p>&copy; is used for the Copyright © symbol, and [y] displays the present year.</p>

The Twenty7 theme has settings for the "Connections" links that appear on the side-panel in the NextJS site.

#### Settings › Connections

- <strong>Link</strong>: Only the URL and title is used here.
- <strong>Icon</strong>: You can paste any SVG icon you'd like. Just make sure it's monotone, because my endpoint adds fill="currentColor" to all paths.

The Twenty7 theme also redesigns the WordPress login page.

#### Settings › Login

- <strong>Headline</strong>: The larger text that appears on the left side of the login form.
- <strong>Description</strong>: A small excerpt that appears below the headline.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Add changelog
- [ ] Fix performance issues and bugs
  - [x] Cumulative layout shift
  - [ ] Improve (or remove) lazyloading
  - [x] Fix next/head tags
- [ ] Switch away from imgix
- [ ] Introduce a chapter CPT with it&apos;s own taxonomies including story
- [ ] Utilize ACF for post subtitles
- [ ] Add proper dependencies to the WordPress theme and plugins
- [ ] Add a dark mode
- [ ] Completely eliminate the need for Advanced Custom Fields

See the [open issues](https://github.com/twenty7dn/site/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

**🌟 Your Contributions Make a Difference! 🌟**

The beauty of the open source community lies in collaboration – it’s a place to learn, inspire, and innovate together. Every contribution you make enriches this community, and your efforts are **deeply valued and appreciated**.

If you have ideas that could enhance this project, we warmly welcome your input:

1.  **Fork the Project**: Begin by forking the repository. This is your personal canvas to experiment and brainstorm new features.

2.  **Create Your Feature Branch**: Switch to your own feature branch with `git checkout -b feature/AmazingFeature`. This is where your creativity comes to life!

3.  **Commit Your Changes**: Once your amazing feature is ready, commit your changes with `git commit -m 'Add some AmazingFeature'`. It's your contribution's milestone!

4.  **Push to the Branch**: Share your work with the world! Push your changes to the branch with `git push origin feature/AmazingFeature`.

5.  **Open a Pull Request**: Finally, submit a pull request. It’s a call to the community to discuss and refine your idea.

🌈 And don’t forget – if you like this project, give it a star! Your support means the world to us. 🌈

Thanks for being a part of this journey. Together, let’s build something incredible!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

David M. Coleman: [@crossrambles.com](https://bsky.app/profile/crossrambles.com) - howdy@crossrambles.com

Project Link: [https://github.com/twenty7dn/site](https://github.com/twenty7dn/site)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Vercel](https://vercel.com)
- [Img Shields](https://shields.io)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)
- [Worldview WordPress Theme](https://upthemes.com/themes/worldview/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
