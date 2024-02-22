import React, { useEffect, useState } from 'react';
import { useLayout, useMyList, useTheme } from '../providers/context';
import { Avatar, Col, Drawer, List, Menu, Row, Space, Spin, Tabs, Typography } from 'antd';
import { Link, Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { APP_ROUTES } from '../routes';
import Search from 'antd/es/input/Search';
import wpScan from '../utils/wpScan';
import InfiniteScroll from '../components/infiniteScroll';
import { TheHtml } from '../utils/html';
import { PostThumbnail } from '../components/post';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useScrollDirection } from '../utils/function';

function ChannelPage(props) {
    const { website } = useMyList()
    let { channelId, postId } = useParams();
    const theWp = website.find(w => w.id == channelId);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get("c")

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoadig] = useState(true);
    const [message, setMessage] = useState(false);

    const [category, setCategory] = useState([])
    const cuttentCat = category?.find(cat => cat.id == categoryId)
    const [posts, setPosts] = useState([])
    const [categoryLoading, setCategoryLoading] = useState([])

    // let _category = query.get("categories") ? `&categories=${query.get("categories")}` : ``;
    const wp = wpScan({ wpUrl: theWp?.url });

    const { messageAPi } = useLayout();
    useEffect(() => {
        setCategory([]);
        if (theWp) {
            const fetchData = () => {
                setCategoryLoading(true)
                wp.getCategory().then((data) => {
                    setCategory(data);
                }).catch((error) => {
                    messageAPi.error(error?.message);
                    // setWpError(error?.message)
                }).finally(() => {
                    setCategoryLoading(false)
                });
            };
            fetchData()
        }
    }, [theWp]);
    const fetchPost = () => {
        setLoadig(true)
        // setWpError(null)
        wp.getPost({ categories: categoryId, page: page }).then((data) => {
            setPosts(old => [...old, ...data]);
            setMessage(cuttentCat?.count - posts?.length)
        }).catch((error) => {
            setHasMore(false)
            messageAPi.error(error?.message);
            // setWpError(error?.message)
        }).finally(() => {
            setLoadig(false)
        });
    };
    useEffect(() => {
        setHasMore(true)
        setPosts([])
        setPage(1)
    }, [theWp, categoryId])

    const loadMore = () => {
        if (theWp && hasMore && !loading) {
            setPage((pre) => pre + 1);
            // console.log("loading page:" + page)
            // console.log("has more", hasMore)
        } else {
            messageAPi.error("no");
        }
    }
    useEffect(() => {
        fetchPost()
    }, [page, theWp, categoryId])
    const type = 'poster';

    const navigate = useNavigate();
    const { setHue } = useTheme()
    useEffect(() => {
        setHue(theWp.color_hue)
    }, [theWp])
    const { direction } = useScrollDirection()
    return (
        <div key={channelId}>
            <Drawer
                width={'100%'}
                closeIcon={<ArrowLeftOutlined />}
                onClose={() => navigate(APP_ROUTES.CHANNEL_ID(channelId))}
                closable={false}
                open={!!postId}>
                <Outlet />
            </Drawer>
            <div className={`${direction == 'down' ? "-translate-y-16" : ""} bg-white transition duration-150 ease-out px-4 sticky top-0`}>
                <Space >
                    <ArrowLeftOutlined onClick={() => navigate(APP_ROUTES.HOME)} />
                    <Avatar src={<img src={theWp.site_icon_url} />} />
                    {theWp.name}
                </Space>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {
                    (posts || []).map((w) => (
                        <Link key={w.id} to={APP_ROUTES.POST_DETAIL(channelId, w.id)} style={{ display: "block", width: '100%' }}>
                            <PostThumbnail data={w} type={type} />
                        </Link>
                    ))
                }
            </div>

            <InfiniteScroll
                loadMore={loadMore}
                loading={loading}
                hasMore={hasMore}
            />
            <div style={{ position: 'sticky', bottom: 0 }}>
                <center>{message}</center>
            </div>
            <div className={`${direction == 'down' ? "translate-y-16" : ""} transition duration-150 ease-out sticky bottom-0`}>
                {categoryLoading ? <Spin /> : <Menu
                    selectedKeys={[categoryId]} mode="horizontal" items={category.map(c => {
                        return {
                            label: <Link to={`${APP_ROUTES.CHANNEL_ID(channelId)}?c=${c.id}`}>{c.name} [${c.count}]</Link>,
                            key: c.id,
                        }
                    })} />}
            </div>
        </div>
    );
}

export default ChannelPage;