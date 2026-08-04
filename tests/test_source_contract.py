from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ReferenceCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attributes):
        values = dict(attributes)
        for name in ("href", "src"):
            value = values.get(name)
            if value:
                self.references.append(value)


class SourceContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "index.html").read_text(encoding="utf-8")

    def test_all_local_page_references_exist(self):
        parser = ReferenceCollector()
        parser.feed(self.html)
        missing = []
        for reference in parser.references:
            if reference.startswith(("#", "http://", "https://", "mailto:")):
                continue
            path = reference.split("?", 1)[0].split("#", 1)[0]
            if path and not (ROOT / path).exists():
                missing.append(reference)
        self.assertEqual(missing, [])

    def test_truth_boundary_and_four_interface_states_remain_present(self):
        self.assertIn("Independent sample - fictional data - not client work", self.html)
        for state in ("ready", "loading", "empty", "error"):
            self.assertIn(f'data-state-view="{state}"', self.html)
            self.assertIn(f'data-state-control="{state}"', self.html)

    def test_page_has_no_external_runtime_asset(self):
        parser = ReferenceCollector()
        parser.feed(self.html)
        external = [
            reference
            for reference in parser.references
            if reference.startswith(("http://", "https://"))
        ]
        self.assertEqual(external, [])

    def test_required_public_documents_exist(self):
        required = [
            "README.md",
            "SECURITY.md",
            "LICENSE",
            "CHANGELOG.md",
            "docs/ARCHITECTURE.md",
            "docs/ACCEPTANCE_MODEL.md",
            "docs/DEMO_SCRIPT.md",
            "docs/VERIFICATION.md",
            "docs/LIMITATIONS.md",
            "docs/DEBUGGING_CASE_STUDY.md",
        ]
        self.assertEqual([path for path in required if not (ROOT / path).exists()], [])


if __name__ == "__main__":
    unittest.main()
