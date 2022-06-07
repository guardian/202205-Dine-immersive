// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h, createElement } from "preact";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap, Sine} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Brother from "./Brother";
import store, {assetsPath, fetchData} from "./store";
import {Provider, useSelector, useDispatch} from "react-redux";
import { useEffect, useRef, useState } from "preact/hooks";
import AudioPlayer from "../../../../shared/js/AudioPlayer";
import { ScrollDown } from "./Icons";


gsap.registerPlugin(ScrollTrigger);

const Container = ({children}) => {
    return (
        <div className="container">
            {children}
        </div>
    )
}
// const FlexContainer = (props) => {
const FlexContainer = ({children, className}) => {
    return (
        <div className={`flex-container ${className}`} >
            {children}
        </div>
    )
}
const PaddedContainer = ({children, className}) => {
    return (
        <div className={`padded-container ${className}`} >
            {children}
        </div>
    )
}

const PaidForBy = () => {
    const data = useSelector(s=>s.content);
    
    return (
        <div className="paid-for " >
            <p>Paid for by</p>
            <a href={data.logoLink} target='_blank'><img src='<%= path %>/logo.png' width="96"/></a>
            <div dangerouslySetInnerHTML={setHtml(data.aboutContent)} />
        </div>
    )
}

const setHtml = (html) => ({__html: html});

const Header = () => {
    const globalData = useSelector(s=>s.content);

    useEffect(() => {
        gsap.from(['.hub','.title','.standfirst'],{duration: 1, y: 20, alpha: 0, delay: 2, stagger: 0.3});
    },[])
    return (
        <div className="labs-header">
            <LoopingBgVid src={`${assetsPath}/hero.mp4`} />
            <FlexContainer className="fl-col justify-end">
                <PaidForBy/>
                <div className='title-wrap'>
                    <div className="hub" dangerouslySetInnerHTML={setHtml(globalData.hubLink)}></div>
                    <h1 className="title text-bg text-center" dangerouslySetInnerHTML={setHtml(globalData.headline)}></h1>
                </div>
                {/* <h1>
                ‘It all comes back to holy basil’: <br/>
                <span class="sub">how Palisa Anderson’s farm and community helped save her restaurant</span>
                </h1> */}
                <RawHtml markup={globalData.standfirst} className="pb-4 pt-4 mx-auto lg:w-2/5 text-center standfirst" />
            </FlexContainer>
        </div>
    )
}

const Panel = ({className, children}) => <div className={`panel ${className}`}>{children}</div>;

const ImagePanel = ({className, children, image}) => {
    const bgRef = useRef();

    useEffect(()=>{
        ScrollTrigger.create({
            trigger: bgRef.current,
            start: "top bottom",
            animation: gsap.to(bgRef.current, {scale: 1.1}),
            scrub: true
          });
    },[]);

    return <Panel className="image-panel">
        <div className="bg-container" style={{backgroundImage: `url(${image})`}} ref={bgRef}>
            {children && 
            <Container>
                {children}
            </Container>
            }
        </div>
    </Panel>
}

const AudioSection = () => 
    <Container>
        <div className="audio-article">

        </div>
    </Container>

const CenterPara = ({className, children}) => 
    <div className="center-para">
        {children}
    </div>

const LoopingBgVid = ({src, image}) => 
    <div className="video-bg">
        {image &&
        <div className="image" style={{backgroundImage: `url(${image})`}} ></div>
        }
        {src && 
        <video src={`${src}`} loop muted='true' autoPlay width="400" height="200" playsInline></video>
        }
    </div>

const CustomVideo = ({src, image}) => 
    <div className="video">
        {image &&
        <div className="image" style={{backgroundImage: `url(${image})`}} ></div>
        }
        {src && 
        <video src={`${src}`} loop muted='true' autoPlay width="400" height="200" playsInline></video>
        }
    </div>

const Youtube = ({videoId, title = 'Youtube player'}) =>
    <div className="yt-vid">
        <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

const Loading = () => 
    <FlexContainer className="loading">
        <div>
            <img src={`${assetsPath}/glab_logo.svg`} width='300' />
        </div>
    </FlexContainer>

const RawHtml = ({markup, tag = 'div', ...props}) => {
    return createElement(tag,
        {   
            ...props,
            dangerouslySetInnerHTML: {__html: markup}
        });
}

const Main = () => {
    const loaded = useSelector(s=>s.dataLoaded);
    
    const mainRef = useRef();

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch( fetchData('https://interactive.guim.co.uk/docsdata/1dsb5tX9F-FYtrXPWv50yuLHw_1YlYKU2Fp9YiPsBbGY.json') );
    },[]);

    if (!loaded) {
        return <Loading />;
    } else {
        const content = useSelector(s=>s.content);
        const relatedItems = useSelector(s=>s.sheets.related);
        const [data, setData] = useState({});

        const relatedList = relatedItems.map(v=>
            <li>
                <a href={v.link}>
                    <img src={`${v.image}`} alt=""/>
                    <div dangerouslySetInnerHTML={setHtml(v.content)}></div>
                </a>
            </li>);

        useEffect(() => {
            gsap.to(mainRef.current, {delay: 0.5, duration: 2, alpha: 1, ease: 'sine.out'});

            
        }, [])
        return (
            <div className="glab-main" ref={mainRef}>
                <Header />
                <section style="min-height: 90vh; padding: 4rem 0;">
                    <LoopingBgVid src={`${assetsPath}/hero_2.mp4`} />
                    <div className="body-block">
                        <PaddedContainer className="relative">
                            <CenterPara>
                                <RawHtml markup={content.body} tag="div" />
                            </CenterPara>
                            <div className="mt-8 flex justify-center">
                                <ScrollDown />
                            </div>
                        </PaddedContainer>

                    </div>
                </section>
                <section style='height: 90vh;' className="overflow-visible">
                    <LoopingBgVid image={`${assetsPath}/section_001_header.jpg`} />
                    <div className="flex items-end justify-center z-10 h-full absolute left-0 -bottom-8 w-full">
                        <RawHtml className="text-bg" markup={content.s1Title} tag="h1"/>

                    </div>
                </section>
                <section  style="--panelBgColor:#211F50;">
                    <PaddedContainer>
                        <CenterPara>
                            <div dangerouslySetInnerHTML={setHtml(content.s1Block1)}></div>
                        </CenterPara>          
                    </PaddedContainer>
                    <div className="flex justify-center flex-wrap">
                        <CustomVideo src={`${assetsPath}/portrait_001.mp4`} />
                        <CustomVideo src={`${assetsPath}/portrait_002.mp4`} />
                        <CustomVideo src={`${assetsPath}/portrait_003.mp4`} />
                    </div>
                    <PaddedContainer>
                        <CenterPara>
                            <div dangerouslySetInnerHTML={setHtml(content.s1Block2)}></div>
                        </CenterPara>
                    </PaddedContainer>


                </section>
                <section style='height: 90vh;' className="overflow-visible">
                    <LoopingBgVid src={`${assetsPath}/section_002_header.mp4`} />
                    <div className="flex items-end justify-center z-10 h-full absolute left-0 -bottom-8 w-full">
                        <RawHtml className="text-bg" markup={content.s2Title} tag="h1"/>

                    </div>
                </section>
                <section className="pt-8">
                    <PaddedContainer>
                        <div className="flex justify-center flex-wrap lg:flex-nowrap">

                            <CenterPara>
                                <div dangerouslySetInnerHTML={setHtml(content.s2Block1)}></div>
                            </CenterPara>
                            <img src={`${assetsPath}/map.svg`} width="512" />
                        </div>

                        <div className="image-grid">
                            <img src={`${assetsPath}/image_s2_001_2x.jpg`} width="512" />
                            <img src={`${assetsPath}/image_s2_002_2x.jpg`} width="512" />
                            <img src={`${assetsPath}/image_s2_003_2x.jpg`} width="512" />
                            <img src={`${assetsPath}/image_s2_004_2x.jpg`} width="512" />
                        </div>
                    </PaddedContainer>
                </section>      
                <section style='height: 90vh;' className="overflow-visible">
                    <LoopingBgVid src={`${assetsPath}/section_003_header.mp4`} />
                    <div className="flex items-end justify-center z-10 h-full absolute left-0 -bottom-8 w-full">
                        <RawHtml className="text-bg" markup={content.s3Title} tag="h1"/>
                    </div>
                </section>
                <section style="--panelBgColor:#ABE6D8;--panelColor:black;">
                    <PaddedContainer>
                        <CenterPara>
                            <div dangerouslySetInnerHTML={setHtml(content.s3Block1)}></div>
                            <div dangerouslySetInnerHTML={setHtml(content.s3Block2)}></div>
                        </CenterPara>
                    </PaddedContainer>

                </section>
                <section style="--panelBgColor:#37BEA0;">
                    <PaddedContainer > 
                        <div className="break">
                            <hr/>
                            <hr/>
                            <hr/>
                            <hr/>
                        </div>

                        <div className="cta text-center">
                            <div dangerouslySetInnerHTML={setHtml(content.cta)}></div>            
                        </div>

                        <div className="share">
                            <SocialBar title={content.shareTitle} url={content.shareUrl} />
                        </div>
                    </PaddedContainer>
                    <div className="pb-8"></div>
                </section>
                <footer>
                    <div className="container padded-container">
                        <h2>Related content</h2>
                        <ul className='list-unstyled related-list'>
                            {relatedList}
                        </ul>

                    </div>
                </footer>
            </div>
        );
    }
}


const App = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>

    )
}

render( <App/>, document.getElementById('Glabs'));
