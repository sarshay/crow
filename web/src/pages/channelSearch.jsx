import React, { useEffect, useRef, useState } from 'react';
import { useLayout, useMyList, useTheme } from '../providers/context';
import { Avatar, Col, Drawer, Flex, List, Menu, Row, Space, Spin, Tabs, Typography } from 'antd';
import { Link, Outlet, unstable_HistoryRouter, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { APP_ROUTES } from '../routes';
import Search from 'antd/es/input/Search';
import wpScan from '../utils/wpScan';
import InfiniteScroll from '../components/infiniteScroll';
import { TheHtml } from '../utils/html';
import { PostThumbnail } from '../components/post';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useScrollDirection } from '../utils/function';

function ChannelSearchPage(props) {
    const { website } = useMyList()
    let { channelId, searchWords, postId } = useParams();
    const theWp = website.find(w => w.id == channelId);
    const [searchParams, setSearchParams] = useSearchParams();
    const category_id = searchParams.get("c")

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoadig] = useState(true);
    const [message, setMessage] = useState(false);

    const [category, setCategory] = useState([])
    const cuttentCat = category?.find(cat => cat.id == category_id)
    const [posts, setPosts] = useState([])
    const [categoryLoading, setCategoryLoading] = useState([])

    // let _category = query.get("categories") ? `&categories=${query.get("categories")}` : ``;
    const wp = wpScan({ wpUrl: theWp?.url, api_base_path: theWp.api_base_path });

    const { messageAPi } = useLayout();
    const postCount = cuttentCat ? cuttentCat.count : category.reduce((acc, c) => acc + c.count, 0);

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
        wp.getPost({ page: page }).then((data) => {
            setPosts(old => [...old, ...data]);
            setMessage(postCount - posts?.length)
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
    }, [theWp, category_id])

    // useEffect(()=>{
    //     fetchPost()
    // },[searchWord])

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
    }, [page, theWp, category_id])
    const type = 'poster';

    const navigate = useNavigate();
    const { setHue } = useTheme()
    useEffect(() => {
        setHue(theWp.color_hue)
    }, [theWp])
    const { direction } = useScrollDirection()
    const [searchOpen, setSearchOpen] = useState(false)
    const inputRef = useRef(null);

    useEffect(() => {
        if (searchOpen) { inputRef.current.focus() }
    }, [searchOpen]);


    const handleSearch = (value) => {
        navigate(APP_ROUTES.SEARCH_IN_CHANNEL(channelId, value))
    };
    return (
        <div key={channelId}>
            <Drawer
                width={'100%'}
                closeIcon={<ArrowLeftOutlined />}
                onClose={() => navigate(APP_ROUTES.CHANNEL_ID(channelId))}
                closable={false}
                open={!!postId}
                className='noPaddingDrawer'>
                <Outlet />
            </Drawer>
            <div className={`${direction == 'down' ? "-translate-y-16" : ""} bg-white transition duration-150 ease-out px-4 py-2 sticky top-0`}>
                <Flex justify='space-between' align='center' gap={16}>
                    <Flex align='center' gap={16} className='flex-1'>
                        <ArrowLeftOutlined onClick={() => navigate(APP_ROUTES.HOME)} />
                        {
                            theWp.site_icon_url ? (
                                <Avatar src={<img src={theWp.site_icon_url} sizes={14} />} />
                            ) : (
                                <Avatar sizes={14}>{theWp.name[0]}</Avatar>
                            )
                        }
                        {searchWords ? <Search ref={inputRef} placeholder='Search' defaultValue={searchWords || null} onSearch={(e) => handleSearch(e)} onBlur={() => { setSearchOpen(false) }} width={'100%'} /> : theWp.name}
                    </Flex>
                    {!searchWords && <SearchOutlined onClick={() => { setSearchOpen(true) }} />}
                </Flex>
            </div>


            <InfiniteScroll
                onEnd={loadMore}
                loading={loading}
                hasMore={hasMore}
                loadingComponent={<center><Spin /></center>}
                offset={300}
            >
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {
                        (posts || []).map((w) => (
                            <Link key={w.id} to={APP_ROUTES.POST_DETAIL(channelId, w.id)} style={{ display: "block", width: '100%' }}>
                                <PostThumbnail data={w} wpInfo={theWp} type={type} />
                            </Link>
                        ))
                    }
                </div>
            </InfiniteScroll>
            <div className='fixed right-0 left-0 bottom-0'>
                <center>{message}</center>
            </div>
            <div className={`${direction == 'down' ? "translate-y-16" : ""} transition duration-150 ease-out fixed right-0 left-0 bottom-0`}>
                {category && <Menu
                    selectedKeys={[category_id]} mode="horizontal" items={category.map(c => {
                        return {
                            label: <Link to={`${APP_ROUTES.CHANNEL_ID(channelId)}?c=${c.id}`}>{c.name} [${c.count}]</Link>,
                            key: c.id,
                        }
                    })} />}
            </div>

        </div>
    );
}

export default ChannelSearchPage;