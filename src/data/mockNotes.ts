/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImaginationNote } from '../types';

export const INITIAL_NOTES: ImaginationNote[] = [
  {
    id: '1',
    title: 'Self-Assembling Synaptic Regeneration Scaffolds for Axonal Guidance',
    domain: 'Biomedicine',
    description: 'Biomimetic extracellular matrix designed via synthetic biopolymers to emulate brain nanoscale topology and induce directional axonal sprouting across spinal lesions.',
    fullDetails: `## Project Vision & Research Background
Central nervous system axon regeneration has long been hindered by inhibitory glial scarring and the lack of sustained neurotrophic support. This project designs a photo-crosslinkable synthetic bio-hydrogel scaffold incorporating engineered elastin-like polypeptides (ELPs) and silk fibroin chimeras.

### Core Technical Architecture
1. **Topographical Contact Guidance**: Microfluidic-assisted supermolecular assembly creates parallel 10-20 μm nanofibrous conduits that provide biomechanical contact cues for axonal growth cones.
2. **Spatiotemporally Controlled Factor Release**: Recombinant BDNF and GDNF precursors are tethered with matrix metalloproteinase (MMP) cleavage sites, triggering active release solely upon local synaptic enzyme secretion.
3. **Immunomodulatory Microenvironment**: Engineered exosomes deliver anti-inflammatory miRNA-124 to selectively polarize microglia from pro-inflammatory M1 to pro-regenerative M2 phenotypes.

### Current Milestone & Collaboration Needs
Long-range directional axonal growth was validated on in vitro neuro-chips, demonstrating a 280% increase in synaptic transmission amplitude. We are seeking clinical and translational research teams with large-animal spinal cord contusion models (canine or non-human primate) for in vivo efficacy validation.`,
    author: {
      name: 'Dr. Elena Vance',
      role: 'Principal Investigator, Neural Synthetic Biology',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=160',
      institution: 'MIT Department of Brain and Cognitive Sciences'
    },
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200',
    tags: ['Biomedicine', 'NeuralBiomaterials', 'TargetedDelivery', 'RegenerativeMedicine'],
    stage: 'Design',
    location: 'Boston, MA · MIT Bio-Frontier Lab',
    createdAt: '2026-09-02T16:20:00Z',
    likes: 3420,
    comments: 48,
    commentsList: [
      {
        id: 'c1',
        author: 'Prof. Julian Graves',
        role: 'Harvard Medical School, Regenerative Lab',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
        content: 'We operate a multi-channel electrophysiology suite in non-human primate models. What is the current in vivo degradation half-life of your hydrogel scaffold? Very eager to collaborate.',
        createdAt: '2026-09-02T18:45:00Z'
      },
      {
        id: 'c2',
        author: 'Dr. Lin Zhang',
        role: 'CAS Bio-Engineering Institute',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
        content: 'The MMP cleavage specificity profile looks exceptional! We have a continuous microfluidic synthesis line capable of gram-scale formulation under GMP-like conditions.',
        createdAt: '2026-09-03T01:10:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Generative Diffusion-Driven De Novo Allosteric Enzyme Design',
    domain: 'AI & Computing',
    description: 'Combining all-atom diffusion models with constrained molecular dynamics to generate non-natural allosteric regulatory pockets for high-precision metabolic pathway switching.',
    fullDetails: `## Research Objective
Natural enzymes have evolved over billions of years for physiological homeostasis, yet rapidly lose stability under industrial conditions such as high osmotic pressure, non-aqueous solvents, and extreme pH. This project develops an end-to-end generative enzyme framework: "SynEnzyme-DiT".

### Technical Architecture
1. **Multimodal Allosteric Diffusion Network**: High-resolution dynamics trajectories serve as prior distributions, while reverse diffusion predicts backbone torsional flexibility and sidechain conformational flips.
2. **Quantum Chemical Screening Operator**: A proprietary density functional theory (DFT) evaluation layer assesses transition-state binding affinity and activation energy barriers within seconds.
3. **Closed-Loop High-Throughput Assay**: Mass cytometry and droplet microfluidic sorting validate over 10^7 variants per cycle, feeding empirical kinetics directly back into the AI model.

### Breakthrough & Partnership Scope
We have designed allosteric biocatalysts that remain completely inert to trace methanol but exhibit a 400-fold catalytic rate surge upon exposure to specific diterpenoid inducers. Seeking automated bio-foundries for chassis integration and pilot fermentation.`,
    author: {
      name: 'Marcus Thorne',
      role: 'Director of Computational Structural Biology',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=160',
      institution: 'MRC Laboratory of Molecular Biology (Cambridge)'
    },
    image: 'https://images.unsplash.com/photo-1530213786676-41ad9f7736f6?auto=format&fit=crop&q=80&w=1200',
    tags: ['AI & Computing', 'GenerativeProteinAI', 'DeNovoEnzymes', 'MolecularDynamics'],
    stage: 'Implementation',
    location: 'Cambridge, UK · MRC LMB Computational Node',
    createdAt: '2026-09-01T10:15:00Z',
    likes: 5890,
    comments: 86,
    commentsList: [
      {
        id: 'c3',
        author: 'Dr. Evelyn Reed',
        role: 'Oxford Department of Chemistry',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
        content: 'A 400:1 allosteric switching dynamic is truly unprecedented in synthetic biology. We would love to pilot test these switches in our yeast paclitaxel precursor biosynthesis line.',
        createdAt: '2026-09-01T14:20:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Self-Sustaining Bioluminescent Street Canopies & Circadian Gene Circuits',
    domain: 'Synthetic Biology',
    description: 'Engineering deep-sea luciferase operons into angiosperm chloroplast genomes, harnessing photosynthetic ATP to generate ambient night glow without external chemical substrates.',
    fullDetails: `## Project Vision & Urban Ecology
Municipal street lighting accounts for more than 18% of global municipal electricity consumption. This project integrates an autonomous bioluminescent gene cassette into urban tree species (e.g., Ginkgo biloba and Acer rubrum), replacing energy-intensive lamps with soothing biological luminescence.

### Genetic Engineering Strategy
1. **Plastid Multi-Gene Insertion**: Overcoming nuclear gene silencing by integrating the complete codon-optimized luciferin-luciferase pathway and caffeic acid recycling circuit into the chloroplast genome.
2. **Circadian Rhythm Coupling**: Linking bioluminescent activation to nocturnal transcription factor promoters ensures full-capacity photosynthetic carbon fixation during the day and automatic emission at dusk.
3. **Biocontainment & Pollen Nullification**: Utilizing maternal inheritance of plastids combined with inducible male sterility prevents any environmental gene flow to wild relatives.`,
    author: {
      name: 'Marcus Chen',
      role: 'Plant Synthetic Biology Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160',
      institution: 'ETH Zurich · Synthetic Biology Center'
    },
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=1200',
    tags: ['Synthetic Biology', 'Bioluminescence', 'PlastidEngineering', 'CircadianCircuits'],
    stage: 'Design',
    location: 'Zurich, Switzerland · ETH Botanical Research Dome',
    createdAt: '2026-08-30T11:00:00Z',
    likes: 4210,
    comments: 63,
    commentsList: [
      {
        id: 'c4',
        author: 'Sarah Jenkins',
        role: 'Urban Ecology Consultant',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
        content: 'What is the measured lux output at 2 meters above pedestrian walkways? Do you have continuous photometric control data across seasonal leaf cycles?',
        createdAt: '2026-08-30T15:20:00Z'
      }
    ]
  },
  {
    id: '4',
    title: 'High-Density DNA Living Chromosome Storage & In-Cell Error Correction',
    domain: 'Synthetic Biology',
    description: 'Employing unnatural base pairs (dNaM-d5SICS) to synthesize artificial micro-chromosomes, capable of storing 215 PB per gram with autonomous cellular error-correction.',
    fullDetails: `## The Future of Archival Storage
Global digital data generation is surging exponentially, while magnetic tape and silicon substrates suffer from finite decadal degradation and colossal cooling overheads. Synthetic DNA offers extraordinary volumetric density (over 200 PB per gram) and multi-millennial stability.

### Key Innovations
1. **Hachimoji Quaternary Transcoding**: A non-repetitive topological mapping algorithm transcribes video and cold archival streams into hairpin-free, ultra-stable nucleotide sequences.
2. **Deinococcus-Derived Repair Machinery**: Co-opting the radical repair cascades of Deinococcus radiodurans autonomously rectifies point mutations, indels, and strand breaks during cellular division.
3. **Solid-State Nanopore Array**: Microfluidic nanopore sensors achieve 10 GB/s direct electrical sequencing readout from living colonies.`,
    author: {
      name: 'Prof. Julian Thorne',
      role: 'DNA Information Architect',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=160',
      institution: 'European Molecular Biology Laboratory (EMBL Heidelberg)'
    },
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200',
    tags: ['Synthetic Biology', 'DNADataStorage', 'SyntheticChromosomes', 'Bioinformatics'],
    stage: 'Production',
    location: 'Heidelberg, Germany · EMBL Genomic Computing Center',
    createdAt: '2026-08-28T09:40:00Z',
    likes: 8920,
    comments: 142,
    commentsList: []
  },
  {
    id: '5',
    title: 'Neuromorphic Melanin Conductive Microfibers for Non-Invasive BCI',
    domain: 'Neurotech',
    description: 'Synthesizing biocompatible polymeric melanin microfibers via engineered E. coli fermentation, eliminating immune rejection for ultralow-noise chronic neural telemetry.',
    fullDetails: `## Research Objective
Conventional metal and silicon brain-computer interface electrodes trigger pronounced neuroglial encapsulation over chronic implantation, degrading signal-to-noise ratios. This project develops fully organic, bio-resorbable neural probes from biosynthesized melanin polymers.

### Highlights
- Engineered tyrosinases catalytically induce high-density catechol crosslinking under ambient physiological conditions.
- Wet-spinning integration with conductive PEDOT:PSS yields microscopic impedance as low as 12 kΩ·cm².
- Continuous high-fidelity single-unit action potential recording demonstrated over 18 months in murine motor cortices without foreign-body response.`,
    author: {
      name: 'Dr. Weihan Li',
      role: 'Lead Neural Interface Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160',
      institution: 'Shenzhen Institute of Advanced Technology · Brain Cognition Center'
    },
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200',
    tags: ['Neurotech', 'BrainComputerInterface', 'Biosensors', 'BiomimeticMaterials'],
    stage: 'Implementation',
    location: 'Shenzhen, China · Guangming Brain Science Infrastructure',
    createdAt: '2026-08-27T15:30:00Z',
    likes: 6730,
    comments: 95,
    commentsList: []
  },
  {
    id: '6',
    title: 'Carbon-Negative Mycelium Structural Units & Self-Healing Living Concrete',
    domain: 'Clean Biomanufacturing',
    description: 'Engineering fungal mycelium seeded with carbonic anhydrase-expressing cyanobacteria on agricultural straw, mineralizing atmospheric CO2 into structural living masonry.',
    fullDetails: `## Planetary Manufacturing Mission
Traditional Portland cement accounts for approximately 8% of total anthropogenic carbon emissions worldwide. "BioMycoStone" is an engineered living building material (ELM) that actively sequesters atmospheric carbon during growth.

### Technical Performance
- 28-day compressive strength surpasses standard C30 commercial cement (reaching 38.6 MPa).
- Net sequestration of 120 kg CO2 mineralized per cubic meter of finished structural block.
- In the presence of micro-cracks and rainfall, dormant fungal mycelia and bacterial spores reactivate to secrete calcium carbonate, autonomously sealing structural faults.`,
    author: {
      name: 'Aria Silver',
      role: 'Living Materials Pioneer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=160',
      institution: 'TU Delft · Faculty of Architecture & Ecological Design'
    },
    image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1200',
    tags: ['Clean Biomanufacturing', 'CarbonNegativeMaterials', 'LivingArchitecture', 'Biomineralization'],
    stage: 'Design',
    location: 'Delft, Netherlands · TU Delft Eco-Structure Center',
    createdAt: '2026-08-25T14:10:00Z',
    likes: 3180,
    comments: 42,
    commentsList: []
  },
  {
    id: '7',
    title: 'Universal CAR-NK Immunotherapy via Exosomal Glycan Remodeling',
    domain: 'Biomedicine',
    description: 'A chemo-enzymatic platform reshaping natural killer cell glycocalyx coats without viral transfection, conferring HLA-independent infiltration into solid tumor stroma.',
    fullDetails: `## Overcoming Solid Tumor Barriers
Autologous CAR-T therapies require protracted 3-4 week manufacturing cycles, incur exorbitant costs, and show limited infiltration in dense solid tumor microenvironments. Universal allogeneic CAR-NK cells represent the next paradigm shift.

### Technical Highlights
1. **Non-Genetic Enzymatic Glycocalyx Editing**: Engineered FUT7 fucosyltransferases and synthetic glycan ligands install high-affinity tumor-targeting scFvs within 30 minutes without genomic disruption.
2. **Neutralizing the Immunosuppressive Stroma**: Cell-surface co-tethered adenosine-degrading ectoenzymes dissolve the surrounding immunosuppressive microenvironment upon encounter.`,
    author: {
      name: 'Dr. Arthur Penhaligon',
      role: 'Immuno-Oncology Researcher',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=160',
      institution: 'The Institute of Cancer Research (ICR London)'
    },
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80&w=1200',
    tags: ['Biomedicine', 'CAR-NKTherapy', 'GlycoEngineering', 'SolidTumorImmunotherapy'],
    stage: 'Implementation',
    location: 'London, UK · ICR Centre for Cancer Immunotherapy',
    createdAt: '2026-08-22T08:30:00Z',
    likes: 4920,
    comments: 79,
    commentsList: []
  },
  {
    id: '8',
    title: 'Autonomous Microfluidic Droplet Assembler & Robotic Cloning Foundry',
    domain: 'AI & Computing',
    description: 'Integrating multi-phase microfluidics with reinforcement learning decision trees to compress conventional DNA cloning from 3 days to 45 minutes enzyme-free.',
    fullDetails: `## Laboratory Automation Breakthrough
Molecular cloning and plasmid assembly represent a major manual bottleneck across synthetic biology. We present "BioPrinter Micro-X", an automated benchtop robotic synthesizer.

### Core Capabilities
- Sub-nanoliter volume reaction droplets handled with acoustic levitation and infrared micro-heating for thermal transformation.
- Achieves 99.4% homologous recombination yields, interfacing directly with standard high-throughput liquid handling systems.`,
    author: {
      name: 'David Kim',
      role: 'Bio-Instrumentation Scientist',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=160',
      institution: 'Stanford University · Bio-X Microfluidics Facility'
    },
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
    tags: ['AI & Computing', 'RoboticCloning', 'Microfluidics', 'BioFoundryAutomation'],
    stage: 'Production',
    location: 'Stanford, CA · Bio-X Interdisciplinary Complex',
    createdAt: '2026-08-19T13:45:00Z',
    likes: 7410,
    comments: 115,
    commentsList: []
  },
  {
    id: '9',
    title: 'Radiotolerant Cyanobacterial Photoautotrophs for Martian Biomanufacturing',
    domain: 'Synthetic Biology',
    description: 'Directed evolution incorporating tardigrade Dsup damage-suppressor proteins into Synechococcus, synthesizing bioplastics and carbohydrates under sub-baric CO2.',
    fullDetails: `## Deep Space In-Situ Resource Utilization (ISRU)
Interplanetary exploration cannot rely entirely on resupply from Earth. This project engineers photoautotrophic microbes tailored for low atmospheric pressures (~600 Pa) and cosmic ionizing radiation.

### Key Modifications
- Expression of tardigrade-specific disordered protein Dsup suppresses hydroxyl radical-induced DNA strand breakage.
- An engineered fatty acid secretion pathway enables continuous export of biopolymer monomers directly into liquid medium without cell lysis.`,
    author: {
      name: 'Dr. Sarah Lin',
      role: 'Senior Astrobiologist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160',
      institution: 'NASA Ames Research Center · Astrobiology Institute'
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    tags: ['Synthetic Biology', 'Astrobiology', 'MartianISRU', 'RadiationTolerance'],
    stage: 'Idea',
    location: 'Moffett Field, CA · NASA Ames Exploration Lab',
    createdAt: '2026-08-15T17:20:00Z',
    likes: 5120,
    comments: 67,
    commentsList: []
  },
  {
    id: '10',
    title: 'Synthetic Epigenetic Reset Circuits for Reversing Cardiomyocyte Senescence',
    domain: 'Biomedicine',
    description: 'Transient OSKM delivery via cardiac-tropic lipid nanoparticles to reverse epigenetic aging drift and fibrotic remodeling in post-infarction ischemic cardiac tissue.',
    fullDetails: `## Project Vision & Research Background
Ischemic heart failure is characterized by the permanent loss of mature cardiomyocytes and progressive fibrotic scar remodeling. Although somatic reprogramming factors (Oct4, Sox2, Klf4, c-Myc) can induce pluripotency, continuous expression in vivo results in teratoma formation. This project builds a synthetic self-inactivating epigenetic reset circuit.

### Technical Architecture
1. **Cardiac-Tropic mRNA-LNP Formulation**: Formulated with heart-specific peptide-conjugated ionizable lipids to selectively transfect border-zone cardiomyocytes while evading hepatic clearance.
2. **Auto-Inactivating Epigenetic Switch**: Expresses a transient pulse of Yamanaka factors coupled with a microRNA-208a regulated destabilizer loop, strictly limiting reprogramming factor duration to 48 hours.
3. **Restoration of Contractility**: Reverses telomere-associated heterochromatin decay and restores mitochondrial oxidative phosphorylation capacity without inducing loss of cell identity.

### Current Milestone & Collaboration Needs
In vitro human cardiac organoid models demonstrated a 65% reversal in senescence-associated beta-galactosidase activity and restored synchronous calcium transients. We are seeking collaborative wet-lab partners with rodent myocardial infarction models and echocardiography cores.`,
    author: {
      name: 'Dr. Clara Montero',
      role: 'Principal Investigator, Cardiac Regeneration',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=160',
      institution: 'Karolinska Institutet · Department of Medicine'
    },
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200',
    tags: ['Biomedicine', 'EpigeneticReprogramming', 'CardiacRegeneration', 'mRNA-LNP'],
    stage: 'Implementation',
    location: 'Stockholm, Sweden · Karolinska Bio-Clinic Core',
    createdAt: '2026-08-10T11:00:00Z',
    likes: 6280,
    comments: 84,
    commentsList: []
  }
];
