import { Feed } from "feed";

const AtomFeed = () => {
  return null;
};

export async function getServerSideProps({ req, res }: { req: any; res: any }) {
  const [options, blog] = await Promise.all([
    fetch(`${process.env.WORDPRESS_HOST}/api`).then((res) => res.json()),
    fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?_embed`).then((res) =>
      res.json(),
    ),
  ]);

  res.setHeader("Content-Type", "text/xml");

  const feed = new Feed({
    title: `${options?.name} › Atom Feed`,
    description: options?.description,
    id: process.env.FRONTEND_HOST as string,
    link: process.env.FRONTEND_HOST,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: options?.site_logo_url,
    favicon: `${process.env.WORDPRESS_HOST}/core/template/twentyseven-theme/assets/icons/favicon.ico`,
    copyright: options?.site_footer?.desktop,
    updated: new Date(), // optional, default = today
    generator: "NextJS", // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: `${process.env.FRONTEND_HOST}/feed/json`,
      rss: `${process.env.FRONTEND_HOST}/feed/rss`,
      atom: `${process.env.FRONTEND_HOST}/feed/atom`,
    },
    author: {
      name: options?.site_author?.name,
      link: options?.site_author?.link,
    },
  });

  blog.map((post: any) => {
    feed.addItem({
      title: post?.title.rendered,
      id: `${process.env.FRONTEND_HOST}/blog/${post?.slug}`,
      link: `${process.env.FRONTEND_HOST}/blog/${post?.slug}`,
      description: post?.excerpt.rendered,
      content: post?.content.rendered,
      author: [
        {
          name: post?._embedded?.author[0]?.name,
          link: post?._embedded?.author[0]?.link,
        },
      ],
      date: new Date(post?.modified_gmt),
      image: post?.featured_media?.src,
    });

    let categories: any = [];

    post?.terms?.topics?.map((topic: any) => {
      categories.push(topic.name);
    });

    let postCategories = Array.from(new Set(categories));

    postCategories.map((category: any) => {
      feed.addCategory(category);
    });
  });

  res.write(feed.atom1());
  res.end();

  return {
    props: {},
    revalidate: 300,
  };
}

export default AtomFeed;
