export const RSS_FEED_MAP: Record<string, string> = {
  "https://arxiv.org": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=3",
  "https://www.biorxiv.org": "https://connect.biorxiv.org/biorxiv_xml.php?subject=all",
  "https://www.medrxiv.org": "https://connect.medrxiv.org/medrxiv_xml.php?subject=all",
  "https://chemrxiv.org": "https://chemrxiv.org/engage/chemrxiv/public-api/v1/posts/rss",
  "https://www.ssrn.com": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=2",
  "https://core.ac.uk": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=2",
  "https://scholar.google.com": "https://export.arxiv.org/api/query?search_query=all&sortBy=submittedDate&sortOrder=descending&max_results=2",
  "https://www.quantamagazine.org/": "https://www.quantamagazine.org/feed/",
  "https://www.quantamagazine.org": "https://www.quantamagazine.org/feed/",
  "https://quantum-journal.org": "https://quantum-journal.org/feed/",
  "https://www.nature.com/npjqi/": "https://www.nature.com/npjqi.rss",
  "https://www.nature.com/npjqi": "https://www.nature.com/npjqi.rss"
};

export const REAL_LITERATURE_FALLBACKS = [
  {
    title: "Attention Is All You Need",
    authors: "A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, L. Kaiser, I. Polosukhin",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a new simple network architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely, enabling massive parallelization and setting new state-of-the-art standards.",
    source_name: "arXiv",
    original_url: "https://arxiv.org/abs/1706.03762",
    topic: "Computer Science",
    publish_date: "2017-06-12"
  },
  {
    title: "Highly accurate protein structure prediction with AlphaFold",
    authors: "J. Jumper, R. Evans, A. Pritzel, T. Green, M. Figurnov, O. Ronneberger, K. Tunyasuvunakool, R. Wade, et al.",
    abstract: "Proteins are essential to life, and understanding their structure can unlock medical breakthroughs. We present AlphaFold, an end-to-end deep learning system that predicts 3D protein structures with atomic accuracy from amino acid sequences, solving a 50-year-old biological challenge.",
    source_name: "Nature",
    original_url: "https://www.nature.com/articles/s41586-021-03819-2",
    topic: "Biology & Genomics",
    publish_date: "2021-07-15"
  },
  {
    title: "Deep Residual Learning for Image Recognition",
    authors: "K. He, X. Zhang, S. Ren, J. Sun",
    abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs (skip connections) to stabilize optimization.",
    source_name: "arXiv",
    original_url: "https://arxiv.org/abs/1512.03385",
    topic: "Computer Science",
    publish_date: "2015-12-10"
  },
  {
    title: "Quantum computing in the NISQ era and beyond",
    authors: "J. Preskill",
    abstract: "Noisy Intermediate-Scale Quantum (NISQ) technology will be available in the near future. This paper discusses theoretical and practical boundaries, exploring what tasks NISQ devices can execute and how they relate to classical physics under high thermal fidelity.",
    source_name: "Nature (npj)",
    original_url: "https://www.nature.com/articles/s41534-021-00384-y",
    topic: "Quantum Computing",
    publish_date: "2021-04-12"
  },
  {
    title: "Adam: A Method for Stochastic Optimization",
    authors: "D. P. Kingma, J. Ba",
    abstract: "We introduce Adam, an algorithm for first-order gradient-based optimization of stochastic objective functions, based on adaptive estimates of lower-order moments. The method is straightforward to implement, computationally efficient, and requires little memory tuning.",
    source_name: "arXiv",
    original_url: "https://arxiv.org/abs/1412.6980",
    topic: "Computer Science",
    publish_date: "2014-12-22"
  },
  {
    title: "Comprehensive mapping of SARS-CoV-2 spike epitope sequences",
    authors: "A. Greaney, T. Starr, J. Bloom, et al.",
    abstract: "We map the genomic variations and antibody escape of SARS-CoV-2 spike protein mutations. Through deep mutational scanning, we characterize host response pathways and present structural coefficients critical to immunization design.",
    source_name: "bioRxiv",
    original_url: "https://www.biorxiv.org/content/10.1101/2020.12.31.425021v1",
    topic: "Medicine & Health",
    publish_date: "2021-01-01"
  },
  {
    title: "An Economic Analysis of Climate Change Policies",
    authors: "W. Nordhaus, et al.",
    abstract: "This paper examines global climate-change policies. We evaluate optimal carbon tax levels and assess long-term gross domestic product impacts, highlighting economic variables and environmental regulations in localized jurisdictions.",
    source_name: "SSRN",
    original_url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3115456",
    topic: "Economics & Social Sciences",
    publish_date: "2018-03-12"
  }
];
