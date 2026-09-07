/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface PastProject {
  title: string;
  year: string;
  outcome: string;
  tag: string;
}

export interface ResearchLab {
  id: string;
  name: string;
  institution: string;
  institutionLogo?: string;
  domain: 'Synthetic Biology' | 'Biomedicine' | 'AI & Computing' | 'Neurotech' | 'Clean Biomanufacturing';
  researchDirections: string[];
  representativeProjects: string[];
  location: string;
  summary: string;
  fullBio: string;
  teamMembers: TeamMember[];
  pastProjects: PastProject[];
  acceptingCreativeDirections: string[];
  establishedYear: string;
  capacityStatus: 'Available' | 'High Demand' | 'Reviewing Proposals';
  leadPI: string;
  contactEmail: string;
  badge?: string;
  matchScore?: number;
}

export const RESEARCH_LABS: ResearchLab[] = [
  {
    id: 'lab-1',
    name: 'Wyss Bio-Robotics & Synthetic Morphogenesis Group',
    institution: 'Harvard University / Wyss Institute',
    domain: 'Synthetic Biology',
    researchDirections: [
      'Engineered Living Materials (ELMs)',
      'Organ-on-Chip Microfluidics',
      'Programmable Tissue Scaffolding',
    ],
    representativeProjects: [
      'Self-healing living cartilage bio-scaffolds with integrated vascular channels',
      'Micro-robotic cellular swarms for localized biofilm eradication',
      'High-throughput mechanical strain screening for engineered myocardium',
    ],
    location: 'Boston, MA, United States',
    summary: 'Pioneering programmable living materials and microphysiological systems to translate bioengineering into clinical therapies.',
    fullBio: 'The Wyss Bio-Robotics & Synthetic Morphogenesis Group bridges synthetic biology with mechanical robotics to engineer multicellular living systems. Our 14,000 sq ft wet-lab and cleanroom facility includes multi-photon laser lithography, automated continuous perfusion microfluidic arrays, and class-1000 bio-printing suites capable of sub-micron precision assembly.',
    teamMembers: [
      {
        name: 'Prof. Donald E. Ingber',
        role: 'Founding Director & Lead PI',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        bio: 'Pioneer in cellular mechanobiology and organ-on-a-chip technologies.',
      },
      {
        name: 'Dr. Jennifer Martinez',
        role: 'Senior Microfluidics Lead',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
        bio: 'Specialist in organoid vascularization and microfluidic sensing.',
      },
      {
        name: 'Dr. Liam Chen',
        role: 'Bio-Polymer Scientist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        bio: 'Expert in dynamic covalent crosslinking and stimulus-responsive hydrogels.',
      },
    ],
    pastProjects: [
      {
        title: '3D Bioprinted Human Glomerulus-on-a-Chip',
        year: '2025',
        outcome: 'Validated selective albumin retention for 60+ days without loss of barrier fidelity.',
        tag: 'Kidney Translation',
      },
      {
        title: 'Photosynthetic Living Biocomposites for Skin Grafting',
        year: '2024',
        outcome: 'Supplied continuous dissolved oxygen accelerating full-thickness burn healing by 45%.',
        tag: 'Regenerative Skin',
      },
      {
        title: 'Sub-Cellular DNA Mechanical Tension Probes',
        year: '2023',
        outcome: 'Direct optical readout of piconewton forces across integrin clusters during cell migration.',
        tag: 'Mechanobiology',
      },
    ],
    acceptingCreativeDirections: [
      'Non-invasive in vivo biochemical sensors embedded in living hydrogels',
      'Synthetic symbiosis between mammalian cell cultures and photosynthetic cyanobacteria',
      'Closed-loop bio-hybrid controllers for targeted immunotherapy release',
    ],
    establishedYear: '2016',
    capacityStatus: 'Available',
    leadPI: 'Prof. Donald E. Ingber',
    contactEmail: 'ingber.lab@wyss.harvard.edu',
    badge: 'Tier-1 Partner',
  },
  {
    id: 'lab-2',
    name: 'Broad Institute Center for Cell Circuitry & Genomic Design',
    institution: 'Broad Institute of MIT and Harvard',
    domain: 'AI & Computing',
    researchDirections: [
      'Generative Machine Learning for Regulatory DNA',
      'Multiplexed CRISPR Perturbation Screening',
      'Single-Cell Spatial Transcriptomics',
    ],
    representativeProjects: [
      'Ultra-scale Perturb-seq mapping of 100,000 regulatory elements across immune lineages',
      'Diffusion models for de novo synthetic enhancer design with 92% cell-type specificity',
      'Long-context genomic foundation models predicting non-coding mutation pathogenicity',
    ],
    location: 'Cambridge, MA, United States',
    summary: 'Developing computational foundation models and high-throughput experimental perturbation pipelines to decode and re-engineer gene regulatory circuits.',
    fullBio: 'We operate at the convergence of artificial intelligence and high-dimensional experimental biology. Our infrastructure houses automated acoustic liquid handlers, Illumina NovaSeq X Plus platforms, and a dedicated 512-GPU compute cluster optimized for training billion-parameter biomolecular generative models.',
    teamMembers: [
      {
        name: 'Dr. Aviv Regev',
        role: 'Chief Scientific Advisor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        bio: 'Pioneer in single-cell genomics, computational biology, and cellular circuit architecture.',
      },
      {
        name: 'Dr. Alexey Morozov',
        role: 'Computational Lead & ML Fellow',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        bio: 'Focuses on multimodal latent representations of cellular states.',
      },
      {
        name: 'Sonia Patel, Ph.D.',
        role: 'High-Throughput Assays Director',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        bio: 'Architect of pooled combinatorial CRISPR screening workflows.',
      },
    ],
    pastProjects: [
      {
        title: 'Cellular Foundation Model: RegulatoryGPT',
        year: '2025',
        outcome: 'Zero-shot prediction of transcription factor binding across 45 human cell states.',
        tag: 'Foundation Models',
      },
      {
        title: 'Multiplexed Epigenetic Reprogramming Matrix',
        year: '2024',
        outcome: 'Synchronized reactivation of 14 suppressed tumor suppressor loci in patient glioblastoma organoids.',
        tag: 'Oncogenomics',
      },
    ],
    acceptingCreativeDirections: [
      'Generative sequence models for tissue-specific synthetic promoters with minimal off-target activity',
      'Inverse biomolecular design of synthetic transcription factors with orthogonal ligand gates',
      'AI-directed closed-loop active learning for evolutionary protein fitness optimization',
    ],
    establishedYear: '2019',
    capacityStatus: 'Available',
    leadPI: 'Dr. Aviv Regev & Dr. Alexey Morozov',
    contactEmail: 'cellcircuitry@broadinstitute.org',
    badge: 'Verified AI Lab',
  },
  {
    id: 'lab-3',
    name: 'ETH Zurich Laboratory of Applied Mechanobiology',
    institution: 'ETH Zurich',
    domain: 'Biomedicine',
    researchDirections: [
      'Fibronectin Matrix Bio-nanotechnology',
      'Extracellular Matrix (ECM) Re-engineering',
      'Anti-Fibrotic Drug Screening Systems',
    ],
    representativeProjects: [
      'Molecular tension sensors reporting ECM remodeling in live fibrotic lungs',
      'Engineered peptide antagonists breaking pathological collagen cross-linking',
      'Synthetic peptide matrices directing human neural crest stem cell differentiation',
    ],
    location: 'Zurich, Switzerland',
    summary: 'Deciphering how cells sense and respond to physical forces in disease progression, and engineering biomaterial solutions for tissue repair.',
    fullBio: 'Located at the Hönggerberg campus, our group utilizes single-molecule atomic force microscopy, optical tweezers, and ultra-high-resolution cryo-electron tomography to study protein mechanical unfolding and design mechanically activated therapeutics.',
    teamMembers: [
      {
        name: 'Prof. Viola Vogel',
        role: 'Head of Laboratory',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200',
        bio: 'Global pioneer in mechanobiology and biomaterials design.',
      },
      {
        name: 'Dr. Markus Keller',
        role: 'Senior Biophysicist',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
        bio: 'Expert in FRET-based molecular force spectrometry.',
      },
    ],
    pastProjects: [
      {
        title: 'Force-Activated Pro-Drug Nano-capsules',
        year: '2025',
        outcome: 'Selective chemotherapeutic activation under hemodynamic shear stress in tumor microvasculature.',
        tag: 'Drug Delivery',
      },
      {
        title: 'Artificial Pericardium Membrane with Anti-Adhesion Coating',
        year: '2023',
        outcome: 'Complete prevention of retrosternal fibrosis in preclinical sheep cardiac models.',
        tag: 'Surgical Bio-devices',
      },
    ],
    acceptingCreativeDirections: [
      'Force-sensitive synthetic hydrogels for real-time biomechanical diagnostics',
      'Bio-inspired adhesives capable of wet-tissue bonding under extreme shear stress',
      'Nanofiber scaffolds directing functional microvascular capillary anastomosis',
    ],
    establishedYear: '2014',
    capacityStatus: 'Reviewing Proposals',
    leadPI: 'Prof. Viola Vogel',
    contactEmail: 'mechanobio@hest.ethz.ch',
  },
  {
    id: 'lab-4',
    name: 'Stanford Synthetic Neuroscience & Opto-Proteomics Lab',
    institution: 'Stanford University',
    domain: 'Neurotech',
    researchDirections: [
      'Genetically Encoded Voltage & Neurotransmitter Indicators',
      'Optogenetic Circuit Dissection',
      'Ultrasound-Gated Neuromodulation',
    ],
    representativeProjects: [
      'Kilohertz-rate sub-cellular voltage imaging across intact cortex in awake behaving mice',
      'Two-photon excitation optogenetic actuators for single-synapse plasticity steering',
      'Non-invasive mechanosensitive acoustic channels for deep brain targeted stimulation',
    ],
    location: 'Stanford, CA, United States',
    summary: 'Creating cutting-edge molecular tools and optical interfaces to record and modulate neural circuits at single-millisecond and single-neuron resolution.',
    fullBio: 'We develop molecular sensors, light-driven actuators, and acoustic transceivers for neural interface engineering. Our facilities include 6 custom-built two-photon holographic microscopes, automated patch-clamp electrophysiology workstations, and deep-learning pipeline nodes for terabyte-scale volumetric calcium and voltage deconvolution.',
    teamMembers: [
      {
        name: 'Prof. Karl Deisseroth',
        role: 'Laboratory Director',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
        bio: 'Co-creator of optogenetics and hydrogel-tissue chemistry (CLARITY).',
      },
      {
        name: 'Dr. Maya Lin',
        role: 'Molecular Engineering Lead',
        avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=200',
        bio: 'Designer of ultra-fast rhodopsin variants and bright chemigenetic indicators.',
      },
    ],
    pastProjects: [
      {
        title: 'All-Optical Brain-Machine Interrogation in Primates',
        year: '2025',
        outcome: 'Real-time decoding and optogenetic feedback with sub-5ms closed-loop latency.',
        tag: 'Optogenetics',
      },
      {
        title: 'Genetically Targeted Sonogenetic Receptors',
        year: '2024',
        outcome: 'Non-invasive focus ultrasound neuromodulation of subthalamic nucleus alleviating motor deficits.',
        tag: 'Sonogenetics',
      },
    ],
    acceptingCreativeDirections: [
      'Near-infrared or acoustic deep-tissue neural actuators requiring zero cranial implant',
      'Multiplexed synthetic neurotransmitter reporters operating simultaneously across 4 distinct spectra',
      'Biocompatible bio-synthetic recording arrays integrated with live organoid neural networks',
    ],
    establishedYear: '2015',
    capacityStatus: 'Available',
    leadPI: 'Prof. Karl Deisseroth',
    contactEmail: 'deisseroth.research@stanford.edu',
    badge: 'Premier Center',
  },
  {
    id: 'lab-5',
    name: 'Synthetic Microbial Ecology & Circular Biomanufacturing',
    institution: 'Technical University of Denmark (DTU Biosustain)',
    domain: 'Clean Biomanufacturing',
    researchDirections: [
      'Metabolic Pathway Rewiring in Non-Model Microorganisms',
      'Continuous Gas Fermentation & C1 Carbon Assimilation',
      'Enzymatic Bio-Depolymerization of Mixed Polymers',
    ],
    representativeProjects: [
      'Engineered Cupriavidus necator producing PHB bioplastics directly from captured industrial CO2',
      'Consortia of thermophilic actinobacteria degrading recalcitrant polyurethane foams',
      'Synthetic auxotrophy biocontainment circuits with zero escapability in open environments',
    ],
    location: 'Lyngby, Denmark',
    summary: 'Engineering robust microbial cell factories and synthetic consortia to transform industrial off-gases and agricultural residues into high-value biopolymers and sustainable fuels.',
    fullBio: 'DTU Biosustain represents one of Europe’s largest synthetic biology biomanufacturing testbeds. We operate 20 pilot bioreactors (ranging from 10L to 1,000L), complete inline Raman spectroscopy monitors, and an automated strain engineering foundry capable of generating 10,000 microbial variants per week.',
    teamMembers: [
      {
        name: 'Prof. Jens Nielsen',
        role: 'Scientific Director',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        bio: 'Pioneer in genome-scale metabolic models and metabolic engineering of yeast and bacteria.',
      },
      {
        name: 'Dr. Helene Thomsen',
        role: 'Fermentation Scale-Up Head',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
        bio: 'Specialist in continuous gas-fermentation kinetics and bioreactor hydrodynamics.',
      },
    ],
    pastProjects: [
      {
        title: 'Zero-Carbon Microbial Protein Synthesis Platform',
        year: '2025',
        outcome: '98% conversion efficiency of formic acid to food-grade single-cell protein.',
        tag: 'Sustainable Protein',
      },
      {
        title: 'Super-Secreting Pichia pastoris for Industrial Enzymes',
        year: '2024',
        outcome: '3.4x titer increase in high-density fermentation without cellular lysis.',
        tag: 'Enzyme Production',
      },
    ],
    acceptingCreativeDirections: [
      'High-throughput screening for synthetic plastic-eating enzymes with hyper-stability at 70°C',
      'Electro-microbial synthesis connecting renewable surplus electricity directly to carbon fixation',
      'Engineered microbial consortia for decentralized water decontamination and rare earth recovery',
    ],
    establishedYear: '2018',
    capacityStatus: 'Available',
    leadPI: 'Prof. Jens Nielsen',
    contactEmail: 'nielsen.biomanufacturing@biosustain.dtu.dk',
  },
  {
    id: 'lab-6',
    name: 'Cambridge Molecular Biocomputing & DNA Data Storage Lab',
    institution: 'University of Cambridge',
    domain: 'AI & Computing',
    researchDirections: [
      'High-Density In Vitro DNA Information Storage',
      'Enzymatic DNA Synthesis & Microfluidic Writing',
      'Enzymatic Logic Gates & Molecular Computing',
    ],
    representativeProjects: [
      'Exabyte-density archival file encoding with error-correcting synthetic DNA origami indexing',
      'In-cell DNA strand-displacement calculators executing Boolean logic in living hepatocytes',
      'Light-directed photolithographic enzymatic synthesis of 500-mer oligonucleotides',
    ],
    location: 'Cambridge, United Kingdom',
    summary: 'Developing the fundamental molecular machinery to store digital information and execute programmatic computation inside biological molecules.',
    fullBio: 'Supported by the EPSRC and Wellcome Trust, our laboratory integrates semiconductor manufacturing techniques with enzymatic DNA chemistry. We operate micro-capillary synthesis chambers, mass spectrometry characterization suites, and molecular simulation clusters.',
    teamMembers: [
      {
        name: 'Prof. Richard Wright',
        role: 'Principal Investigator',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
        bio: 'Specialist in molecular communications, nanotechnology, and nucleic acid logic circuits.',
      },
      {
        name: 'Dr. Clara Oswald',
        role: 'DNA Synthesis Chemistry Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        bio: 'Pioneer of template-free enzymatic DNA polymerase engineering.',
      },
    ],
    pastProjects: [
      {
        title: 'Permanent Cold Storage of Human Genome Archive in Synthetic Silica',
        year: '2025',
        outcome: 'Projected information retention exceeds 10,000 years with 0.0001% bit degradation.',
        tag: 'DNA Storage',
      },
    ],
    acceptingCreativeDirections: [
      'Hybrid electronic-biological memory buses enabling direct CMOS-to-DNA write bandwidth',
      'Enzymatic search algorithms querying DNA-stored image datasets without full sequencing',
      'Self-assembling molecular neural networks computing classification tasks in solution',
    ],
    establishedYear: '2020',
    capacityStatus: 'Available',
    leadPI: 'Prof. Richard Wright',
    contactEmail: 'dna.biocomputing@cam.ac.uk',
  },
];
