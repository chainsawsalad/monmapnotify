const fetch = require('node-fetch');
const notifier = require('node-notifier');
const moment = require('moment');

const notificationCache = {};

// curl -s 'https://www.mwbmap.net/api/get_data' \
// -H 'cookie: __cfduid=d00e8ff202a8a79ccafa8e0836211ee5d1550804908; SESSION-TOKEN=A62DF0C5-2068-4FD6-AB33-E0C90C82BCBA; CSRF-TOKEN=3613CFAB-F609-4F4E-86ED-7A06F220205C' \
// -H 'origin: https://www.mwbmap.net' \
// -H 'accept-encoding: identity' \
// -H 'accept-language: en-US,en;q=0.9' \
// -H 'x-requested-with: XMLHttpRequest' \
// -H 'pragma: no-cache' \
// -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36' \
// -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8' \
// -H 'accept: */*' \
// -H 'cache-control: no-cache' \
// -H 'authority: www.mwbmap.net' \
// -H 'referer: https://www.mwbmap.net/' \
// -H 'dnt: 1' \
// --data '_=1553632612&min_lat=42.344496907147175&max_lat=42.37126211305265&min_lon=-71.09624281525612&max_lon=-71.034444719553&show_gyms=false&show_raids=true&show_pokestops=false&show_quests=true&show_pokemon=true&pokemon_filter_exclude=%5B%5D&quest_filter_exclude=%5B%22p1%22%2C%22p2%22%2C%22p3%22%2C%22p4%22%2C%22p5%22%2C%22p6%22%2C%22p7%22%2C%22p8%22%2C%22p9%22%2C%22p10%22%2C%22p11%22%2C%22p12%22%2C%22p13%22%2C%22p14%22%2C%22p15%22%2C%22p16%22%2C%22p17%22%2C%22p18%22%2C%22p19%22%2C%22p20%22%2C%22p21%22%2C%22p22%22%2C%22p23%22%2C%22p24%22%2C%22p25%22%2C%22p26%22%2C%22p27%22%2C%22p28%22%2C%22p29%22%2C%22p30%22%2C%22p31%22%2C%22p32%22%2C%22p33%22%2C%22p34%22%2C%22p35%22%2C%22p36%22%2C%22p37%22%2C%22p38%22%2C%22p39%22%2C%22p40%22%2C%22p41%22%2C%22p42%22%2C%22p43%22%2C%22p44%22%2C%22p45%22%2C%22p46%22%2C%22p47%22%2C%22p48%22%2C%22p49%22%2C%22p50%22%2C%22p51%22%2C%22p52%22%2C%22p53%22%2C%22p54%22%2C%22p55%22%2C%22p56%22%2C%22p57%22%2C%22p58%22%2C%22p59%22%2C%22p60%22%2C%22p61%22%2C%22p62%22%2C%22p63%22%2C%22p64%22%2C%22p65%22%2C%22p66%22%2C%22p67%22%2C%22p68%22%2C%22p69%22%2C%22p70%22%2C%22p71%22%2C%22p72%22%2C%22p73%22%2C%22p74%22%2C%22p75%22%2C%22p76%22%2C%22p77%22%2C%22p78%22%2C%22p79%22%2C%22p80%22%2C%22p81%22%2C%22p82%22%2C%22p83%22%2C%22p84%22%2C%22p85%22%2C%22p86%22%2C%22p87%22%2C%22p88%22%2C%22p89%22%2C%22p90%22%2C%22p91%22%2C%22p92%22%2C%22p93%22%2C%22p94%22%2C%22p95%22%2C%22p96%22%2C%22p97%22%2C%22p98%22%2C%22p99%22%2C%22p100%22%2C%22p101%22%2C%22p102%22%2C%22p103%22%2C%22p104%22%2C%22p105%22%2C%22p106%22%2C%22p107%22%2C%22p108%22%2C%22p109%22%2C%22p110%22%2C%22p111%22%2C%22p112%22%2C%22p113%22%2C%22p114%22%2C%22p115%22%2C%22p116%22%2C%22p117%22%2C%22p118%22%2C%22p119%22%2C%22p120%22%2C%22p121%22%2C%22p122%22%2C%22p123%22%2C%22p124%22%2C%22p125%22%2C%22p126%22%2C%22p127%22%2C%22p128%22%2C%22p129%22%2C%22p130%22%2C%22p131%22%2C%22p132%22%2C%22p133%22%2C%22p134%22%2C%22p135%22%2C%22p136%22%2C%22p137%22%2C%22p138%22%2C%22p139%22%2C%22p140%22%2C%22p141%22%2C%22p142%22%2C%22p143%22%2C%22p144%22%2C%22p145%22%2C%22p146%22%2C%22p147%22%2C%22p148%22%2C%22p149%22%2C%22p150%22%2C%22p151%22%2C%22p152%22%2C%22p153%22%2C%22p154%22%2C%22p155%22%2C%22p156%22%2C%22p157%22%2C%22p158%22%2C%22p159%22%2C%22p160%22%2C%22p161%22%2C%22p162%22%2C%22p163%22%2C%22p164%22%2C%22p165%22%2C%22p166%22%2C%22p167%22%2C%22p168%22%2C%22p169%22%2C%22p170%22%2C%22p171%22%2C%22p172%22%2C%22p173%22%2C%22p174%22%2C%22p175%22%2C%22p176%22%2C%22p177%22%2C%22p178%22%2C%22p179%22%2C%22p180%22%2C%22p181%22%2C%22p182%22%2C%22p183%22%2C%22p184%22%2C%22p185%22%2C%22p186%22%2C%22p187%22%2C%22p188%22%2C%22p189%22%2C%22p190%22%2C%22p191%22%2C%22p192%22%2C%22p193%22%2C%22p194%22%2C%22p195%22%2C%22p196%22%2C%22p197%22%2C%22p198%22%2C%22p199%22%2C%22p200%22%2C%22p201%22%2C%22p202%22%2C%22p203%22%2C%22p204%22%2C%22p205%22%2C%22p206%22%2C%22p207%22%2C%22p208%22%2C%22p209%22%2C%22p210%22%2C%22p211%22%2C%22p212%22%2C%22p213%22%2C%22p214%22%2C%22p215%22%2C%22p216%22%2C%22p217%22%2C%22p218%22%2C%22p219%22%2C%22p220%22%2C%22p221%22%2C%22p222%22%2C%22p223%22%2C%22p224%22%2C%22p225%22%2C%22p226%22%2C%22p227%22%2C%22p228%22%2C%22p229%22%2C%22p230%22%2C%22p231%22%2C%22p232%22%2C%22p233%22%2C%22p234%22%2C%22p235%22%2C%22p236%22%2C%22p237%22%2C%22p238%22%2C%22p239%22%2C%22p240%22%2C%22p241%22%2C%22p242%22%2C%22p243%22%2C%22p244%22%2C%22p245%22%2C%22p246%22%2C%22p247%22%2C%22p248%22%2C%22p249%22%2C%22p250%22%2C%22p251%22%2C%22p252%22%2C%22p253%22%2C%22p254%22%2C%22p255%22%2C%22p256%22%2C%22p257%22%2C%22p258%22%2C%22p259%22%2C%22p260%22%2C%22p261%22%2C%22p262%22%2C%22p263%22%2C%22p264%22%2C%22p265%22%2C%22p266%22%2C%22p267%22%2C%22p268%22%2C%22p269%22%2C%22p270%22%2C%22p271%22%2C%22p272%22%2C%22p273%22%2C%22p274%22%2C%22p275%22%2C%22p276%22%2C%22p277%22%2C%22p278%22%2C%22p279%22%2C%22p280%22%2C%22p281%22%2C%22p282%22%2C%22p283%22%2C%22p284%22%2C%22p285%22%2C%22p286%22%2C%22p287%22%2C%22p288%22%2C%22p289%22%2C%22p290%22%2C%22p291%22%2C%22p292%22%2C%22p293%22%2C%22p294%22%2C%22p295%22%2C%22p296%22%2C%22p297%22%2C%22p298%22%2C%22p299%22%2C%22p300%22%2C%22p301%22%2C%22p302%22%2C%22p303%22%2C%22p304%22%2C%22p305%22%2C%22p306%22%2C%22p307%22%2C%22p308%22%2C%22p309%22%2C%22p310%22%2C%22p311%22%2C%22p312%22%2C%22p313%22%2C%22p314%22%2C%22p315%22%2C%22p316%22%2C%22p317%22%2C%22p318%22%2C%22p319%22%2C%22p320%22%2C%22p321%22%2C%22p322%22%2C%22p323%22%2C%22p324%22%2C%22p325%22%2C%22p326%22%2C%22p328%22%2C%22p329%22%2C%22p330%22%2C%22p331%22%2C%22p332%22%2C%22p333%22%2C%22p334%22%2C%22p335%22%2C%22p336%22%2C%22p337%22%2C%22p338%22%2C%22p339%22%2C%22p340%22%2C%22p341%22%2C%22p342%22%2C%22p343%22%2C%22p344%22%2C%22p345%22%2C%22p346%22%2C%22p347%22%2C%22p348%22%2C%22p349%22%2C%22p350%22%2C%22p351%22%2C%22p352%22%2C%22p353%22%2C%22p354%22%2C%22p355%22%2C%22p356%22%2C%22p357%22%2C%22p358%22%2C%22p359%22%2C%22p360%22%2C%22p361%22%2C%22p362%22%2C%22p363%22%2C%22p364%22%2C%22p365%22%2C%22p367%22%2C%22p368%22%2C%22p369%22%2C%22p370%22%2C%22p371%22%2C%22p372%22%2C%22p373%22%2C%22p374%22%2C%22p375%22%2C%22p376%22%2C%22p377%22%2C%22p378%22%2C%22p379%22%2C%22p380%22%2C%22p381%22%2C%22p382%22%2C%22p383%22%2C%22p384%22%2C%22p385%22%2C%22p386%22%2C%22p387%22%2C%22p388%22%2C%22p389%22%2C%22p390%22%2C%22p391%22%2C%22p392%22%2C%22p393%22%2C%22p394%22%2C%22p395%22%2C%22p396%22%2C%22p397%22%2C%22p398%22%2C%22p399%22%2C%22p400%22%2C%22p401%22%2C%22p402%22%2C%22p403%22%2C%22p404%22%2C%22p405%22%2C%22p406%22%2C%22p407%22%2C%22p408%22%2C%22p409%22%2C%22p410%22%2C%22p411%22%2C%22p412%22%2C%22p413%22%2C%22p414%22%2C%22p415%22%2C%22p416%22%2C%22p417%22%2C%22p418%22%2C%22p419%22%2C%22p420%22%2C%22p421%22%2C%22p422%22%2C%22p423%22%2C%22p424%22%2C%22p425%22%2C%22p426%22%2C%22p427%22%2C%22p428%22%2C%22p429%22%2C%22p430%22%2C%22p431%22%2C%22p432%22%2C%22p433%22%2C%22p434%22%2C%22p435%22%2C%22p436%22%2C%22p437%22%2C%22p438%22%2C%22p439%22%2C%22p440%22%2C%22p441%22%2C%22p442%22%2C%22p443%22%2C%22p444%22%2C%22p445%22%2C%22p446%22%2C%22p447%22%2C%22p448%22%2C%22p449%22%2C%22p450%22%2C%22p451%22%2C%22p452%22%2C%22p453%22%2C%22p454%22%2C%22p455%22%2C%22p456%22%2C%22p457%22%2C%22p458%22%2C%22p459%22%2C%22p460%22%2C%22p461%22%2C%22p462%22%2C%22p463%22%2C%22p464%22%2C%22p465%22%2C%22p466%22%2C%22p467%22%2C%22p468%22%2C%22p469%22%2C%22p470%22%2C%22p471%22%2C%22p472%22%2C%22p473%22%2C%22p474%22%2C%22p475%22%2C%22p476%22%2C%22p477%22%2C%22p478%22%2C%22p479%22%2C%22p480%22%2C%22p481%22%2C%22p482%22%2C%22p483%22%2C%22p484%22%2C%22p485%22%2C%22p486%22%2C%22p487%22%2C%22p488%22%2C%22p489%22%2C%22p490%22%2C%22p491%22%2C%22p492%22%2C%22p493%22%2C%22i-1%22%2C%22i1%22%2C%22i2%22%2C%22i3%22%2C%22i101%22%2C%22i102%22%2C%22i103%22%2C%22i104%22%2C%22i201%22%2C%22i202%22%2C%22i701%22%2C%22i703%22%2C%22i705%22%2C%22i706%22%2C%22i1301%22%5D&pokemon_filter_iv=%7B%22and%22%3A%22100%22%7D&show_spawnpoints=false&show_cells=false&last_update=1553632607&_csrf=3613CFAB-F609-4F4E-86ED-7A06F220205C'

const fetchData = () => {
    fetch('https://www.mwbmap.net/api/get_data', {
        'credentials': 'include',
        'headers':  {
            'cookie': '__cfduid=d00e8ff202a8a79ccafa8e0836211ee5d1550804908; SESSION-TOKEN=A62DF0C5-2068-4FD6-AB33-E0C90C82BCBA; CSRF-TOKEN=3613CFAB-F609-4F4E-86ED-7A06F220205C',
            'origin': 'https://www.mwbmap.net',
            'accept-encoding': 'identity',
            'accept-language': 'en-US,en;q=0.9',
            'x-requested-with': 'XMLHttpRequest',
            'pragma': 'no-cache',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'accept': '*/*',
            'cache-control': 'no-cache',
            'authority': 'www.mwbmap.net',
            'referer': 'https://www.mwbmap.net/',
            'dnt': '1',
        },
        'referrer': 'https: //www.mwbmap.net/',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': '_=' + (+new Date()) + '&min_lat=42.344496907147175&max_lat=42.37126211305265&min_lon=-71.09624281525612&max_lon=-71.034444719553&show_gyms=false&show_raids=true&show_pokestops=false&show_quests=false&show_pokemon=true&pokemon_filter_exclude=%5B%5D&quest_filter_exclude=%5B%22p1%22%2C%22p2%22%2C%22p3%22%2C%22p4%22%2C%22p5%22%2C%22p6%22%2C%22p7%22%2C%22p8%22%2C%22p9%22%2C%22p10%22%2C%22p11%22%2C%22p12%22%2C%22p13%22%2C%22p14%22%2C%22p15%22%2C%22p16%22%2C%22p17%22%2C%22p18%22%2C%22p19%22%2C%22p20%22%2C%22p21%22%2C%22p22%22%2C%22p23%22%2C%22p24%22%2C%22p25%22%2C%22p26%22%2C%22p27%22%2C%22p28%22%2C%22p29%22%2C%22p30%22%2C%22p31%22%2C%22p32%22%2C%22p33%22%2C%22p34%22%2C%22p35%22%2C%22p36%22%2C%22p37%22%2C%22p38%22%2C%22p39%22%2C%22p40%22%2C%22p41%22%2C%22p42%22%2C%22p43%22%2C%22p44%22%2C%22p45%22%2C%22p46%22%2C%22p47%22%2C%22p48%22%2C%22p49%22%2C%22p50%22%2C%22p51%22%2C%22p52%22%2C%22p53%22%2C%22p54%22%2C%22p55%22%2C%22p56%22%2C%22p57%22%2C%22p58%22%2C%22p59%22%2C%22p60%22%2C%22p61%22%2C%22p62%22%2C%22p63%22%2C%22p64%22%2C%22p65%22%2C%22p66%22%2C%22p67%22%2C%22p68%22%2C%22p69%22%2C%22p70%22%2C%22p71%22%2C%22p72%22%2C%22p73%22%2C%22p74%22%2C%22p75%22%2C%22p76%22%2C%22p77%22%2C%22p78%22%2C%22p79%22%2C%22p80%22%2C%22p81%22%2C%22p82%22%2C%22p83%22%2C%22p84%22%2C%22p85%22%2C%22p86%22%2C%22p87%22%2C%22p88%22%2C%22p89%22%2C%22p90%22%2C%22p91%22%2C%22p92%22%2C%22p93%22%2C%22p94%22%2C%22p95%22%2C%22p96%22%2C%22p97%22%2C%22p98%22%2C%22p99%22%2C%22p100%22%2C%22p101%22%2C%22p102%22%2C%22p103%22%2C%22p104%22%2C%22p105%22%2C%22p106%22%2C%22p107%22%2C%22p108%22%2C%22p109%22%2C%22p110%22%2C%22p111%22%2C%22p112%22%2C%22p113%22%2C%22p114%22%2C%22p115%22%2C%22p116%22%2C%22p117%22%2C%22p118%22%2C%22p119%22%2C%22p120%22%2C%22p121%22%2C%22p122%22%2C%22p123%22%2C%22p124%22%2C%22p125%22%2C%22p126%22%2C%22p127%22%2C%22p128%22%2C%22p129%22%2C%22p130%22%2C%22p131%22%2C%22p132%22%2C%22p133%22%2C%22p134%22%2C%22p135%22%2C%22p136%22%2C%22p137%22%2C%22p138%22%2C%22p139%22%2C%22p140%22%2C%22p141%22%2C%22p142%22%2C%22p143%22%2C%22p144%22%2C%22p145%22%2C%22p146%22%2C%22p147%22%2C%22p148%22%2C%22p149%22%2C%22p150%22%2C%22p151%22%2C%22p152%22%2C%22p153%22%2C%22p154%22%2C%22p155%22%2C%22p156%22%2C%22p157%22%2C%22p158%22%2C%22p159%22%2C%22p160%22%2C%22p161%22%2C%22p162%22%2C%22p163%22%2C%22p164%22%2C%22p165%22%2C%22p166%22%2C%22p167%22%2C%22p168%22%2C%22p169%22%2C%22p170%22%2C%22p171%22%2C%22p172%22%2C%22p173%22%2C%22p174%22%2C%22p175%22%2C%22p176%22%2C%22p177%22%2C%22p178%22%2C%22p179%22%2C%22p180%22%2C%22p181%22%2C%22p182%22%2C%22p183%22%2C%22p184%22%2C%22p185%22%2C%22p186%22%2C%22p187%22%2C%22p188%22%2C%22p189%22%2C%22p190%22%2C%22p191%22%2C%22p192%22%2C%22p193%22%2C%22p194%22%2C%22p195%22%2C%22p196%22%2C%22p197%22%2C%22p198%22%2C%22p199%22%2C%22p200%22%2C%22p201%22%2C%22p202%22%2C%22p203%22%2C%22p204%22%2C%22p205%22%2C%22p206%22%2C%22p207%22%2C%22p208%22%2C%22p209%22%2C%22p210%22%2C%22p211%22%2C%22p212%22%2C%22p213%22%2C%22p214%22%2C%22p215%22%2C%22p216%22%2C%22p217%22%2C%22p218%22%2C%22p219%22%2C%22p220%22%2C%22p221%22%2C%22p222%22%2C%22p223%22%2C%22p224%22%2C%22p225%22%2C%22p226%22%2C%22p227%22%2C%22p228%22%2C%22p229%22%2C%22p230%22%2C%22p231%22%2C%22p232%22%2C%22p233%22%2C%22p234%22%2C%22p235%22%2C%22p236%22%2C%22p237%22%2C%22p238%22%2C%22p239%22%2C%22p240%22%2C%22p241%22%2C%22p242%22%2C%22p243%22%2C%22p244%22%2C%22p245%22%2C%22p246%22%2C%22p247%22%2C%22p248%22%2C%22p249%22%2C%22p250%22%2C%22p251%22%2C%22p252%22%2C%22p253%22%2C%22p254%22%2C%22p255%22%2C%22p256%22%2C%22p257%22%2C%22p258%22%2C%22p259%22%2C%22p260%22%2C%22p261%22%2C%22p262%22%2C%22p263%22%2C%22p264%22%2C%22p265%22%2C%22p266%22%2C%22p267%22%2C%22p268%22%2C%22p269%22%2C%22p270%22%2C%22p271%22%2C%22p272%22%2C%22p273%22%2C%22p274%22%2C%22p275%22%2C%22p276%22%2C%22p277%22%2C%22p278%22%2C%22p279%22%2C%22p280%22%2C%22p281%22%2C%22p282%22%2C%22p283%22%2C%22p284%22%2C%22p285%22%2C%22p286%22%2C%22p287%22%2C%22p288%22%2C%22p289%22%2C%22p290%22%2C%22p291%22%2C%22p292%22%2C%22p293%22%2C%22p294%22%2C%22p295%22%2C%22p296%22%2C%22p297%22%2C%22p298%22%2C%22p299%22%2C%22p300%22%2C%22p301%22%2C%22p302%22%2C%22p303%22%2C%22p304%22%2C%22p305%22%2C%22p306%22%2C%22p307%22%2C%22p308%22%2C%22p309%22%2C%22p310%22%2C%22p311%22%2C%22p312%22%2C%22p313%22%2C%22p314%22%2C%22p315%22%2C%22p316%22%2C%22p317%22%2C%22p318%22%2C%22p319%22%2C%22p320%22%2C%22p321%22%2C%22p322%22%2C%22p323%22%2C%22p324%22%2C%22p325%22%2C%22p326%22%2C%22p328%22%2C%22p329%22%2C%22p330%22%2C%22p331%22%2C%22p332%22%2C%22p333%22%2C%22p334%22%2C%22p335%22%2C%22p336%22%2C%22p337%22%2C%22p338%22%2C%22p339%22%2C%22p340%22%2C%22p341%22%2C%22p342%22%2C%22p343%22%2C%22p344%22%2C%22p345%22%2C%22p346%22%2C%22p347%22%2C%22p348%22%2C%22p349%22%2C%22p350%22%2C%22p351%22%2C%22p352%22%2C%22p353%22%2C%22p354%22%2C%22p355%22%2C%22p356%22%2C%22p357%22%2C%22p358%22%2C%22p359%22%2C%22p360%22%2C%22p361%22%2C%22p362%22%2C%22p363%22%2C%22p364%22%2C%22p365%22%2C%22p367%22%2C%22p368%22%2C%22p369%22%2C%22p370%22%2C%22p371%22%2C%22p372%22%2C%22p373%22%2C%22p374%22%2C%22p375%22%2C%22p376%22%2C%22p377%22%2C%22p378%22%2C%22p379%22%2C%22p380%22%2C%22p381%22%2C%22p382%22%2C%22p383%22%2C%22p384%22%2C%22p385%22%2C%22p386%22%2C%22p387%22%2C%22p388%22%2C%22p389%22%2C%22p390%22%2C%22p391%22%2C%22p392%22%2C%22p393%22%2C%22p394%22%2C%22p395%22%2C%22p396%22%2C%22p397%22%2C%22p398%22%2C%22p399%22%2C%22p400%22%2C%22p401%22%2C%22p402%22%2C%22p403%22%2C%22p404%22%2C%22p405%22%2C%22p406%22%2C%22p407%22%2C%22p408%22%2C%22p409%22%2C%22p410%22%2C%22p411%22%2C%22p412%22%2C%22p413%22%2C%22p414%22%2C%22p415%22%2C%22p416%22%2C%22p417%22%2C%22p418%22%2C%22p419%22%2C%22p420%22%2C%22p421%22%2C%22p422%22%2C%22p423%22%2C%22p424%22%2C%22p425%22%2C%22p426%22%2C%22p427%22%2C%22p428%22%2C%22p429%22%2C%22p430%22%2C%22p431%22%2C%22p432%22%2C%22p433%22%2C%22p434%22%2C%22p435%22%2C%22p436%22%2C%22p437%22%2C%22p438%22%2C%22p439%22%2C%22p440%22%2C%22p441%22%2C%22p442%22%2C%22p443%22%2C%22p444%22%2C%22p445%22%2C%22p446%22%2C%22p447%22%2C%22p448%22%2C%22p449%22%2C%22p450%22%2C%22p451%22%2C%22p452%22%2C%22p453%22%2C%22p454%22%2C%22p455%22%2C%22p456%22%2C%22p457%22%2C%22p458%22%2C%22p459%22%2C%22p460%22%2C%22p461%22%2C%22p462%22%2C%22p463%22%2C%22p464%22%2C%22p465%22%2C%22p466%22%2C%22p467%22%2C%22p468%22%2C%22p469%22%2C%22p470%22%2C%22p471%22%2C%22p472%22%2C%22p473%22%2C%22p474%22%2C%22p475%22%2C%22p476%22%2C%22p477%22%2C%22p478%22%2C%22p479%22%2C%22p480%22%2C%22p481%22%2C%22p482%22%2C%22p483%22%2C%22p484%22%2C%22p485%22%2C%22p486%22%2C%22p487%22%2C%22p488%22%2C%22p489%22%2C%22p490%22%2C%22p491%22%2C%22p492%22%2C%22p493%22%2C%22i-1%22%2C%22i1%22%2C%22i2%22%2C%22i3%22%2C%22i101%22%2C%22i102%22%2C%22i103%22%2C%22i104%22%2C%22i201%22%2C%22i202%22%2C%22i701%22%2C%22i703%22%2C%22i705%22%2C%22i706%22%2C%22i1301%22%5D&pokemon_filter_iv=%7B%22and%22%3A%22100%22%7D&show_spawnpoints=false&show_cells=false&last_update=1553629541&_csrf=3613CFAB-F609-4F4E-86ED-7A06F220205C',
        'method': 'POST',
        'mode': 'cors'
    })
    .then((result) => result.json())
    .then((json) => {
        console.log('\n\n\nChecking at %s...\n\n', moment().format('MMMM Do YYYY, h:mm:ss a'));
        json.data.gyms.forEach((gym) => {
            if (gym.ex_raid_eligible) {
                const isActive = gym.raid_battle_timestamp * 1000 < +new Date();
                const title = gym.name + ' Tier ' + gym.raid_level;
                const message = isActive ?
                    'Despawinging at ' + moment(gym.raid_end_timestamp * 1000).format('MMMM Do YYYY, h:mm:ss a') :
                    'Hatching at ' + moment(gym.raid_battle_timestamp * 1000).format('MMMM Do YYYY, h:mm:ss a')
                if (!notificationCache[gym.name + gym.raid_battle_timestamp + isActive]) {
                    notifier.notify({
                        title: title,
                        message: message,
                        icon: gym.url,
                        timeout: 10,
                    });
                    notificationCache[gym.name + gym.raid_battle_timestamp + isActive] = true;
                }
                // console.log(gym);
                console.log('%s\n%s\n-------\n', title, message);
            }
        });
        json.data.pokemon.forEach((pokemon) => {
            notifier.notify({
                title: 'Pokemon Found TODO',
                message: 'Look at logs for data'
            });
            console.log(pokemon);
        });

        setTimeout(fetchData, 1000 * 60 * 2);
    });
};

fetchData();
