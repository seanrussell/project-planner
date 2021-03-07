import '../sass/navigation.scss';

const Navigation = {
  render: () => {
    return `<ul class="nav">
                <li>
                    <a href="/#/" title="Home">
                        <i class="small material-icons">home</i>
                    </a>
                </li>
                <li>
                    <a href="/#/projects" title="Projects">
                        <i class="small material-icons">work</i>
                    </a>
                </li>
                <li>
                    <a href="/#/backlogs" title="Backlogs">
                        <i class="small material-icons">list</i>
                    </a>
                </li>
                <li>
                    <a href="/#/sprints" title="Sprints">
                        <i class="small material-icons">blur_linear</i>
                    </a>
                </li>
                <li>
                    <a href="/#/boards" title="Boards">
                        <i class="small material-icons">dashboard</i>
                    </a>
                </li>
        </ul>`;
  },
  after_render: () => {},
};
export default Navigation;