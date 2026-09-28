from backend.memory.retrieval import MemoryRetriever


def load_initial_memories() -> None:
    """
    Load the synthetic community dataset into shared memory.
    """

    retriever = MemoryRetriever()
    retriever.load_data()